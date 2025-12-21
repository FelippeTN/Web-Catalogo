import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { collectionsService, isUnauthorized } from '../api'
import { useCatalogs } from '../hooks/useCatalogs'

type Props = {
  onLogout: () => void
}

export default function CatalogPage({ onLogout }: Props) {
  const navigate = useNavigate()

  const { catalogs, isLoading, error, errorMessage, reload } = useCatalogs()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const canCreate = useMemo(() => catalogs.length < 5, [catalogs.length])

  function handleLogout() {
    onLogout()
    navigate('/')
  }

  useEffect(() => {
    if (!error) return
    if (isUnauthorized(error)) {
      onLogout()
      navigate('/login', { replace: true })
    }
  }, [error, navigate, onLogout])

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault()
    setCreateError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setCreateError('Informe um nome para a coleção')
      return
    }
    if (!canCreate) {
      setCreateError('Limite de 5 coleções atingido')
      return
    }

    try {
      setIsCreating(true)
      await collectionsService.create({ name: trimmedName, description: description.trim() || undefined })
      setName('')
      setDescription('')
      await reload()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setCreateError(err instanceof Error ? err.message : 'Erro ao criar coleção')
    } finally {
      setIsCreating(false)
    }
  }

  function startEdit(id: string, currentName: string, currentDescription: string) {
    setUpdateError(null)
    setEditingCollectionId(id)
    setEditName(currentName)
    setEditDescription(currentDescription === 'Sem descrição' ? '' : currentDescription)
  }

  function cancelEdit() {
    setUpdateError(null)
    setEditingCollectionId(null)
    setEditName('')
    setEditDescription('')
  }

  async function saveEdit(id: string) {
    setUpdateError(null)

    const trimmedName = editName.trim()
    if (!trimmedName) {
      setUpdateError('Informe um nome para a coleção')
      return
    }

    try {
      setIsUpdating(true)
      await collectionsService.update(Number(id), {
        name: trimmedName,
        description: editDescription.trim() || undefined,
      })
      cancelEdit()
      await reload()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setUpdateError(err instanceof Error ? err.message : 'Erro ao atualizar coleção')
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleDeleteCollection(id: string) {
    setUpdateError(null)

	const ok = window.confirm('Apagar esta coleção? Todos os produtos desta coleção também serão apagados.')
    if (!ok) return

    try {
      await collectionsService.remove(Number(id))
      if (editingCollectionId === id) cancelEdit()
      await reload()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setUpdateError(err instanceof Error ? err.message : 'Erro ao apagar coleção')
    }
  }

  async function handleShareCollection(id: string) {
    try {
      const res = await collectionsService.share(Number(id))
      const url = `${window.location.origin}/c/${res.share_token}`

      try {
        await navigator.clipboard.writeText(url)
      } catch {
        // ignore
      }

      window.prompt('Link do catálogo (copiado se possível):', url)
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setUpdateError(err instanceof Error ? err.message : 'Erro ao gerar link')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 bg-white/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">store</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 tracking-tight leading-tight">Web Catálogo</div>
              <div className="text-xs text-gray-500 font-medium">Catálogos</div>
            </div>
          </div>
        </div>

        <div>
          <button className="bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors cursor-pointer font-medium text-sm" type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-end justify-between mb-8 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seus catálogos</h1>
            <p className="mt-2 text-gray-500">Visualize e mantenha seus catálogos organizados.</p>
          </div>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-8" aria-label="Criar coleção">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">Nova coleção</h2>
              <p className="text-sm text-gray-500 mt-1">Limite de 5 coleções por conta ({catalogs.length}/5).</p>
            </div>
          </div>

          <form className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleCreateCollection}>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="collection-name">Nome</label>
              <input
                id="collection-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                placeholder="Ex: Promoções"
                maxLength={80}
                disabled={isLoading || isCreating || !canCreate}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="collection-description">Descrição (opcional)</label>
              <input
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                placeholder="Uma breve descrição"
                maxLength={140}
                disabled={isLoading || isCreating || !canCreate}
              />
            </div>

            <div className="md:col-span-3 flex items-center justify-between gap-3">
              <div className="text-sm">
                {createError && <span className="text-red-600">{createError}</span>}
                {!createError && !canCreate && <span className="text-gray-500">Você já atingiu o limite de coleções.</span>}
              </div>

              <button
                className="px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading || isCreating || !canCreate}
              >
                {isCreating ? 'Criando...' : 'Criar coleção'}
              </button>
            </div>
          </form>
        </section>

        {isLoading && (
          <div className="text-sm text-gray-500 mb-6">Carregando catálogos...</div>
        )}

        {!isLoading && errorMessage && (
          <div className="text-sm text-red-600 mb-6">{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && catalogs.length === 0 && (
          <div className="text-sm text-gray-500 mb-6">Nenhuma coleção cadastrada ainda.</div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Lista de catálogos">
          {catalogs.map((c) => (
            <article key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow" aria-label={c.name}>
              <div className="flex items-center justify-between gap-4 mb-3">
                {editingCollectionId === c.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    maxLength={80}
                    disabled={isUpdating}
                    aria-label="Nome da coleção"
                  />
                ) : (
                  <h2 className="font-semibold text-lg text-gray-900">{c.name}</h2>
                )}
                <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">{c.items} itens</div>
              </div>
              {editingCollectionId === c.id ? (
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  maxLength={140}
                  disabled={isUpdating}
                  aria-label="Descrição da coleção"
                  placeholder="Descrição (opcional)"
                />
              ) : (
                <p className="text-gray-500 text-sm min-h-[44px] line-clamp-2">{c.description}</p>
              )}
              <div className="flex gap-2 items-center mt-4 text-xs text-gray-400">
                <span>{c.updatedAtLabel}</span>
                <span>•</span>
                <span>Gerencie seus itens</span>
              </div>

              {editingCollectionId === c.id && updateError && (
                <div className="mt-3 text-sm text-red-600">{updateError}</div>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  className="px-3 py-2 text-sm rounded-lg bg-orange-50 text-orange-600 font-medium hover:bg-orange-100 transition-colors"
                  type="button"
                  onClick={() => navigate(`/catalogos/${c.id}`)}
                  disabled={editingCollectionId === c.id}
                >
                  Abrir
                </button>
                {editingCollectionId === c.id ? (
                  <>
                    <button
                      className="px-3 py-2 text-sm rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      type="button"
                      onClick={() => void saveEdit(c.id)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-600 hover:bg-gray-50 transition-colors"
                      type="button"
                      onClick={cancelEdit}
                      disabled={isUpdating}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-500 hover:bg-gray-50 transition-colors"
                      type="button"
                      onClick={() => startEdit(c.id, c.name, c.description)}
                    >
                      Editar
                    </button>

                    <button
                      className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-600 hover:bg-gray-50 transition-colors"
                      type="button"
                      onClick={() => void handleShareCollection(c.id)}
                    >
                      Compartilhar
                    </button>

                    <button
                      className="px-3 py-2 text-sm rounded-lg bg-transparent text-red-600 hover:bg-red-50 transition-colors"
                      type="button"
                      onClick={() => void handleDeleteCollection(c.id)}
                    >
                      Apagar
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-8 text-center text-sm text-gray-400">Interface apenas de frontend.</footer>
    </div>
  )
}
