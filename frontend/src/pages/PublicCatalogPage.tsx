import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { collectionsService } from '../api'
import type { Product } from '../api'

type CartState = Record<string, number>

function formatPrice(value: number): string {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

function getCartStorageKey(token: string): string {
  return `cart:${token}`
}

export default function PublicCatalogPage() {
  const params = useParams()
  const token = String(params.token ?? '')

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [title, setTitle] = useState('Catálogo')
  const [products, setProducts] = useState<Product[]>([])

  const [cart, setCart] = useState<CartState>({})

  useEffect(() => {
    if (!token) return
    try {
      const raw = sessionStorage.getItem(getCartStorageKey(token))
      if (!raw) return
      const parsed = JSON.parse(raw) as unknown
      if (!parsed || typeof parsed !== 'object') return
      setCart(parsed as CartState)
    } catch {
      // ignore
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    try {
      sessionStorage.setItem(getCartStorageKey(token), JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart, token])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!token) {
        setErrorMessage('Link inválido')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage(null)

        const data = await collectionsService.getPublicCatalogByToken(token)

        if (!isMounted) return
        setTitle(data.collection.name || 'Catálogo')
        setProducts(data.products)
      } catch (err) {
        if (!isMounted) return
        setErrorMessage(err instanceof Error ? err.message : 'Erro ao carregar catálogo')
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [token])

  function addToCart(productId: number) {
    setCart((prev) => {
      const key = String(productId)
      const nextQty = (prev[key] ?? 0) + 1
      return { ...prev, [key]: nextQty }
    })
  }

  function decrement(productId: number) {
    setCart((prev) => {
      const key = String(productId)
      const qty = prev[key] ?? 0
      if (qty <= 1) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: qty - 1 }
    })
  }

  function increment(productId: number) {
    addToCart(productId)
  }

  const cartItems = useMemo(() => {
    const items: Array<{ product: Product; qty: number }> = []
    for (const p of products) {
      const qty = cart[String(p.id)] ?? 0
      if (qty > 0) items.push({ product: p, qty })
    }
    return items
  }, [cart, products])

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)
  }, [cartItems])

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0)
  }, [cartItems])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 bg-white/70 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="font-bold text-gray-900 tracking-tight leading-tight">{title}</div>
            <div className="text-xs text-gray-500 font-medium">Catálogo compartilhado</div>
          </div>

          <div className="text-sm text-gray-700">
            Carrinho: <span className="font-semibold">{totalItems}</span> item(ns)
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {isLoading && <div className="text-sm text-gray-500 mb-6">Carregando catálogo...</div>}
        {!isLoading && errorMessage && <div className="text-sm text-red-600 mb-6">{errorMessage}</div>}

        {!isLoading && !errorMessage && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2" aria-label="Produtos">
              {products.length === 0 ? (
                <div className="text-sm text-gray-500">Nenhum produto cadastrado neste catálogo.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((p) => (
                    <article key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm" aria-label={p.name}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-semibold text-gray-900">{p.name}</h2>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatPrice(p.price)}</div>
                      </div>

                      <div className="flex items-center justify-between mt-5">
                        <div className="text-xs text-gray-400">
                          No carrinho: <span className="font-semibold">{cart[String(p.id)] ?? 0}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(p.id)}
                          className="px-3 py-2 text-sm rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                        >
                          Adicionar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <aside className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-fit" aria-label="Carrinho">
              <h2 className="font-semibold text-gray-900">Carrinho</h2>
              <p className="text-sm text-gray-500 mt-1">Salvo apenas nesta sessão do navegador.</p>

              {cartItems.length === 0 ? (
                <div className="text-sm text-gray-500 mt-4">Seu carrinho está vazio.</div>
              ) : (
                <div className="mt-4 space-y-4">
                  {cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{formatPrice(product.price)} cada</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatPrice(product.price * qty)}</div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-gray-700">Qtd: <span className="font-semibold">{qty}</span></div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => decrement(product.id)}
                            className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => increment(product.id)}
                            className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-lg font-bold text-gray-900">{formatPrice(total)}</div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-8 text-center text-sm text-gray-400">Catálogo compartilhado — carrinho por sessão.</footer>
    </div>
  )
}
