import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { isUnauthorized } from '../api'
import { useCatalogs } from '../hooks/useCatalogs'

type Props = {
  onLogout: () => void
}

export default function CatalogPage({ onLogout }: Props) {
  const navigate = useNavigate()

  const { catalogs, isLoading, error, errorMessage } = useCatalogs()

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
                <h2 className="font-semibold text-lg text-gray-900">{c.name}</h2>
                <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">{c.items} itens</div>
              </div>
              <p className="text-gray-500 text-sm min-h-[44px] line-clamp-2">{c.description}</p>
              <div className="flex gap-2 items-center mt-4 text-xs text-gray-400">
                <span>{c.updatedAtLabel}</span>
                <span>•</span>
                <span>Somente UI</span>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="px-3 py-2 text-sm rounded-lg bg-orange-50 text-orange-600 font-medium hover:bg-orange-100 transition-colors cursor-not-allowed opacity-60" type="button" disabled>
                  Abrir
                </button>
                <button className="px-3 py-2 text-sm rounded-lg bg-transparent text-gray-500 hover:bg-gray-50 transition-colors cursor-not-allowed opacity-60" type="button" disabled>
                  Editar
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-8 text-center text-sm text-gray-400">Interface apenas de frontend.</footer>
    </div>
  )
}
