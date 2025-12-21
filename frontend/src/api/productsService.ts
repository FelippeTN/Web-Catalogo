import type { HttpClient } from './httpClient'
import type { CreateProductInput, Product } from './types'

export interface ProductsService {
  getMine(): Promise<Product[]>
  create(input: CreateProductInput): Promise<Product>
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

  getPublic(filters?: { ownerId?: number; collectionId?: number }): Promise<Product[]> {
    return this.http.request<Product[]>('GET', '/public/products', {
      query: {
        owner_id: filters?.ownerId,
        collection_id: filters?.collectionId,
      },
    })
  }
}
