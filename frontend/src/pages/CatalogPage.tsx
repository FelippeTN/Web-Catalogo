import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onLogout: () => void
}

type Catalog = {
  id: string
  name: string
  description: string
  items: number
  updatedAtLabel: string
}

export default function CatalogPage({ onLogout }: Props) {
  const navigate = useNavigate()

  const catalogs = useMemo<Catalog[]>(
    () => [
      {
        id: 'cat-01',
        name: 'Catálogo de Produtos',
        description: 'Lista principal de produtos com categorias e preços.',
        items: 42,
        updatedAtLabel: 'Atualizado hoje',
      },
      {
        id: 'cat-02',
        name: 'Catálogo de Serviços',
        description: 'Serviços oferecidos, pacotes e prazos.',
        items: 18,
        updatedAtLabel: 'Atualizado ontem',
      },
      {
        id: 'cat-03',
        name: 'Coleção 2026',
        description: 'Prévia de lançamentos e variações por cor/tamanho.',
        items: 27,
        updatedAtLabel: 'Atualizado esta semana',
      },
      {
        id: 'cat-04',
        name: 'Materiais de Marketing',
        description: 'Banners, artes, textos e assets para campanhas.',
        items: 12,
        updatedAtLabel: 'Atualizado este mês',
      },
    ],
    [],
  )

  function handleLogout() {
    onLogout()
    navigate('/')
  }

  return (
    <div className="catalog">
      <header className="topbar">
        <div className="topbar__left">
          <div className="brand brand--compact">
            <div className="brand__mark" aria-hidden="true" />
            <div className="brand__text">
              <div className="brand__title">Web Catálogo</div>
              <div className="brand__subtitle">Catálogos</div>
            </div>
          </div>
        </div>

        <div className="topbar__right">
          <button className="btn btn--ghost" type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="catalog__content" role="main">
        <div className="pagehead">
          <div>
            <h1 className="pagehead__title">Seus catálogos</h1>
            <p className="pagehead__subtitle">Visualize e mantenha seus catálogos organizados.</p>
          </div>
        </div>

        <section className="grid" aria-label="Lista de catálogos">
          {catalogs.map((c) => (
            <article key={c.id} className="card card--catalog" aria-label={c.name}>
              <div className="card__top">
                <h2 className="card__title">{c.name}</h2>
                <div className="pill">{c.items} itens</div>
              </div>
              <p className="card__desc">{c.description}</p>
              <div className="card__meta">
                <span className="muted">{c.updatedAtLabel}</span>
                <span className="muted">•</span>
                <span className="muted">Somente UI</span>
              </div>
              <div className="card__actions">
                <button className="btn btn--small" type="button" disabled>
                  Abrir
                </button>
                <button className="btn btn--small btn--ghost" type="button" disabled>
                  Editar
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="appfooter">Interface apenas de frontend.</footer>
    </div>
  )
}
