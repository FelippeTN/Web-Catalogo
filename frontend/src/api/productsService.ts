import type { HttpClient } from './httpClient'
import type { CreateProductInput, Product } from './types'


export type UpdateProductInput = {
  name?: string
  description?: string
  price?: number
  collection_id?: number | null
}

export interface ProductsService {
  getMine(): Promise<Product[]>
  create(input: CreateProductInput): Promise<Product>
  update(id: number, input: UpdateProductInput): Promise<Product>
  remove(id: number): Promise<void>
  getPublic(filters?: { ownerId?: number; collectionId?: number }): Promise<Product[]>
}

export class ApiProductsService implements ProductsService {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  getMine(): Promise<Product[]> {
    return this.http.request<Product[]>('GET', '/protected/products', { auth: true })
  }

  create(input: CreateProductInput): Promise<Product> {
    return this.http.request<Product>('POST', '/protected/products', { auth: true, body: input })
  }

  update(id: number, input: UpdateProductInput): Promise<Product> {
    return this.http.request<Product>('PUT', `/protected/products/${id}`, { auth: true, body: input })
  }

  async remove(id: number): Promise<void> {
    await this.http.request<void>('DELETE', `/protected/products/${id}`, { auth: true })
  }

  getPublic(filters?: { ownerId?: number; collectionId?: number }): Promise<Product[]> {
    return this.http.request<Product[]>('GET', '/public/products', {
      query: {
        owner_id: filters?.ownerId,
        collection_id: filters?.collectionId,
      },
    })
  }
}
