import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { collectionsService, isUnauthorized, productsService } from '../api'
import type { Collection, Product } from '../api'

type Props = {
  onLogout: () => void
}

function formatPrice(value: number): string {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

export default function CollectionPage({ onLogout }: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const collectionId = useMemo(() => Number(params.id), [params.id])

  const [collection, setCollection] = useState<Collection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [isEditingCollection, setIsEditingCollection] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [isUpdatingCollection, setIsUpdatingCollection] = useState(false)
  const [collectionUpdateError, setCollectionUpdateError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [editProductName, setEditProductName] = useState('')
  const [editProductDescription, setEditProductDescription] = useState('')
  const [editProductPrice, setEditProductPrice] = useState('')
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)
  const [productUpdateError, setProductUpdateError] = useState<string | null>(null)

  async function load() {
    if (!Number.isFinite(collectionId) || collectionId <= 0) {
      setErrorMessage('Coleção inválida')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage(null)

      const [cols, prods] = await Promise.all([
        collectionsService.getMine(),
        productsService.getMine(),
      ])

      const found = cols.find((c) => c.id === collectionId) ?? null
      setCollection(found)
      setProducts(prods.filter((p) => p.collection_id === collectionId))

      setIsEditingCollection(false)
      setCollectionUpdateError(null)
      setCollectionName(found?.name ?? '')
      setCollectionDescription(found?.description ?? '')

      if (!found) {
        setErrorMessage('Coleção não encontrada')
      }
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao carregar coleção')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId])

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaveError(null)

    const trimmedName = name.trim()
    const trimmedDesc = description.trim()
    const parsedPrice = Number(String(price).replace(',', '.'))

    if (!trimmedName) {
      setSaveError('Informe o nome do produto')
      return
    }
    if (!trimmedDesc) {
      setSaveError('Informe a descrição do produto')
      return
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setSaveError('Informe um preço válido')
      return
    }

    try {
      setIsSaving(true)
      await productsService.create({
        name: trimmedName,
        description: trimmedDesc,
        price: parsedPrice,
        collection_id: collectionId,
      })
      setName('')
      setDescription('')
      setPrice('')
      await load()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setSaveError(err instanceof Error ? err.message : 'Erro ao cadastrar produto')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteCollection() {
    if (!collection) return

	const ok = window.confirm('Apagar esta coleção? Todos os produtos desta coleção também serão apagados.')
    if (!ok) return

    try {
      await collectionsService.remove(collection.id)
      navigate('/catalogos', { replace: true })
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao apagar coleção')
    }
  }

  async function handleUpdateCollection(e: React.FormEvent) {
    e.preventDefault()
    if (!collection) return

    setCollectionUpdateError(null)
    const trimmedName = collectionName.trim()
    if (!trimmedName) {
      setCollectionUpdateError('Informe um nome para a coleção')
      return
    }

    try {
      setIsUpdatingCollection(true)
      await collectionsService.update(collection.id, {
        name: trimmedName,
        description: collectionDescription.trim() || undefined,
      })
      setIsEditingCollection(false)
      await load()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setCollectionUpdateError(err instanceof Error ? err.message : 'Erro ao atualizar coleção')
    } finally {
      setIsUpdatingCollection(false)
    }
  }

  function startEditProduct(p: Product) {
    setProductUpdateError(null)
    setEditingProductId(p.id)
    setEditProductName(p.name)
    setEditProductDescription(p.description)
    setEditProductPrice(String(p.price))
  }

  function cancelEditProduct() {
    setProductUpdateError(null)
    setEditingProductId(null)
    setEditProductName('')
    setEditProductDescription('')
    setEditProductPrice('')
  }

  async function saveProductEdit(id: number) {
    setProductUpdateError(null)

    const trimmedName = editProductName.trim()
    const trimmedDesc = editProductDescription.trim()
    const parsedPrice = Number(String(editProductPrice).replace(',', '.'))

    if (!trimmedName) {
      setProductUpdateError('Informe o nome do produto')
      return
    }
    if (!trimmedDesc) {
      setProductUpdateError('Informe a descrição do produto')
      return
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setProductUpdateError('Informe um preço válido')
      return
    }

    try {
      setIsUpdatingProduct(true)
      await productsService.update(id, {
        name: trimmedName,
        description: trimmedDesc,
        price: parsedPrice,
        collection_id: collectionId,
      })
      cancelEditProduct()
      await load()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setProductUpdateError(err instanceof Error ? err.message : 'Erro ao atualizar produto')
    } finally {
      setIsUpdatingProduct(false)
    }
  }

  async function deleteProduct(id: number) {
    const ok = window.confirm('Apagar este produto?')
    if (!ok) return

    try {
      await productsService.remove(id)
      if (editingProductId === id) cancelEditProduct()
      await load()
    } catch (err) {
      if (isUnauthorized(err)) {
        onLogout()
        navigate('/login', { replace: true })
        return
      }
      setProductUpdateError(err instanceof Error ? err.message : 'Erro ao apagar produto')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 bg-white/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/catalogos')}
            className="bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            Voltar
          </button>

          <div>
            <div className="font-bold text-gray-900 tracking-tight leading-tight">
              {collection ? collection.name : 'Coleção'}
            </div>
            <div className="text-xs text-gray-500 font-medium">Cadastro de produtos</div>
          </div>
        </div>

        <div>
          <button
            className="bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors cursor-pointer font-medium text-sm"
            type="button"
            onClick={() => {
              onLogout()
              navigate('/')
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {isLoading && <div className="text-sm text-gray-500 mb-6">Carregando...</div>}
        {!isLoading && errorMessage && <div className="text-sm text-red-600 mb-6">{errorMessage}</div>}

        {!isLoading && collection && (
          <>
            <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-8" aria-label="Gerenciar coleção">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900">Coleção</h2>
                  <p className="text-sm text-gray-500 mt-1">Atualize o nome/descrição ou apague a coleção.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCollectionUpdateError(null)
                      setIsEditingCollection((v) => !v)
                      setCollectionName(collection.name)
                      setCollectionDescription(collection.description ?? '')
                    }}
                    className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-600 hover:bg-gray-50 transition-colors"
                    disabled={isUpdatingCollection}
                  >
                    {isEditingCollection ? 'Fechar' : 'Editar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteCollection()}
                    className="px-3 py-2 text-sm rounded-lg bg-transparent text-red-600 hover:bg-red-50 transition-colors"
                    disabled={isUpdatingCollection}
                  >
                    Apagar
                  </button>
                </div>
              </div>

              {isEditingCollection && (
                <form className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleUpdateCollection}>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-collection-name">Nome</label>
                    <input
                      id="edit-collection-name"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                      maxLength={80}
                      disabled={isUpdatingCollection}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-collection-description">Descrição (opcional)</label>
                    <input
                      id="edit-collection-description"
                      value={collectionDescription}
                      onChange={(e) => setCollectionDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                      maxLength={140}
                      disabled={isUpdatingCollection}
                    />
                  </div>

                  <div className="md:col-span-3 flex items-center justify-between gap-3">
                    <div className="text-sm">
                      {collectionUpdateError && <span className="text-red-600">{collectionUpdateError}</span>}
                    </div>

                    <button
                      className="px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isUpdatingCollection}
                    >
                      {isUpdatingCollection ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </form>
              )}
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-8" aria-label="Cadastrar produto">
              <h2 className="font-semibold text-gray-900">Novo produto</h2>
              <p className="text-sm text-gray-500 mt-1">Cadastro simples para esta coleção.</p>

              <form className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleCreateProduct}>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-name">Nome</label>
                  <input
                    id="product-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    placeholder="Ex: Camiseta"
                    maxLength={100}
                    disabled={isSaving}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-price">Preço</label>
                  <input
                    id="product-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    placeholder="Ex: 49.90"
                    inputMode="decimal"
                    disabled={isSaving}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-description">Descrição</label>
                  <input
                    id="product-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    placeholder="Ex: Algodão, tamanhos P/M/G"
                    maxLength={200}
                    disabled={isSaving}
                  />
                </div>

                <div className="md:col-span-3 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    {saveError && <span className="text-red-600">{saveError}</span>}
                  </div>

                  <button
                    className="px-4 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Cadastrar produto'}
                  </button>
                </div>
              </form>
            </section>

            <section aria-label="Produtos da coleção">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Produtos</h2>
                  <p className="text-sm text-gray-500 mt-1">{products.length} item(ns) nesta coleção.</p>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-sm text-gray-500 mb-6">Nenhum produto cadastrado ainda.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <article key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm" aria-label={p.name}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {editingProductId === p.id ? (
                            <>
                              <input
                                value={editProductName}
                                onChange={(e) => setEditProductName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                                maxLength={100}
                                disabled={isUpdatingProduct}
                                aria-label="Nome do produto"
                              />
                              <input
                                value={editProductDescription}
                                onChange={(e) => setEditProductDescription(e.target.value)}
                                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                                maxLength={200}
                                disabled={isUpdatingProduct}
                                aria-label="Descrição do produto"
                              />
                            </>
                          ) : (
                            <>
                              <h3 className="font-semibold text-gray-900">{p.name}</h3>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                            </>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {editingProductId === p.id ? (
                            <input
                              value={editProductPrice}
                              onChange={(e) => setEditProductPrice(e.target.value)}
                              className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                              inputMode="decimal"
                              disabled={isUpdatingProduct}
                              aria-label="Preço do produto"
                            />
                          ) : (
                            formatPrice(p.price)
                          )}
                        </div>
                      </div>

                      {editingProductId === p.id && productUpdateError && (
                        <div className="mt-3 text-sm text-red-600">{productUpdateError}</div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {editingProductId === p.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void saveProductEdit(p.id)}
                              className="px-3 py-2 text-sm rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={isUpdatingProduct}
                            >
                              {isUpdatingProduct ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditProduct}
                              className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-600 hover:bg-gray-50 transition-colors"
                              disabled={isUpdatingProduct}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditProduct(p)}
                              className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteProduct(p.id)}
                              className="px-3 py-2 text-sm rounded-lg bg-transparent text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Apagar
                            </button>
                          </>
                        )}
                      </div>

                      <div className="mt-4 text-xs text-gray-400">Cadastrado em {new Date(p.created_at).toLocaleDateString('pt-BR')}</div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-8 text-center text-sm text-gray-400">Interface simples de cadastro.</footer>
    </div>
  )
}
