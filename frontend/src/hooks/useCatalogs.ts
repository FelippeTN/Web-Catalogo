import { useEffect, useMemo, useState } from 'react'
import { collectionsService, productsService } from '../api'
import type { Collection, Product } from '../api'

export type CatalogCard = {
  id: string
  name: string
  description: string
  items: number
  updatedAtLabel: string
}

function formatUpdatedAtLabel(isoString: string | undefined): string {
  if (!isoString) return 'Sem atualização'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return 'Sem atualização'
  return `Atualizado em ${date.toLocaleDateString('pt-BR')}`
}

export function useCatalogs() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        setErrorMessage(null)

        const [cols, prods] = await Promise.all([
          collectionsService.getMine(),
          productsService.getMine(),
        ])

        if (!isMounted) return
        setCollections(cols)
        setProducts(prods)
      } catch (e) {
        if (!isMounted) return
        setError(e)
        setErrorMessage(e instanceof Error ? e.message : 'Erro ao carregar dados')
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  async function reload() {
    try {
      setIsLoading(true)
      setError(null)
      setErrorMessage(null)

      const [cols, prods] = await Promise.all([
        collectionsService.getMine(),
        productsService.getMine(),
      ])

      setCollections(cols)
      setProducts(prods)
    } catch (e) {
      setError(e)
      setErrorMessage(e instanceof Error ? e.message : 'Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const catalogs = useMemo<CatalogCard[]>(() => {
    const countByCollectionId = new Map<number, number>()
    for (const p of products) {
      if (p.collection_id === null) continue
      countByCollectionId.set(p.collection_id, (countByCollectionId.get(p.collection_id) ?? 0) + 1)
    }

    return collections.map((c) => ({
      id: String(c.id),
      name: c.name,
      description: c.description || 'Sem descrição',
      items: countByCollectionId.get(c.id) ?? 0,
      updatedAtLabel: formatUpdatedAtLabel(c.updated_at),
    }))
  }, [collections, products])

	return { catalogs, isLoading, error, errorMessage, reload }
}
