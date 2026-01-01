import type { HttpClient } from '@/api/httpClient'
import type { Collection, CreateCollectionInput, PublicCatalogResponse, ShareCollectionResponse, UpdateCollectionInput } from '@/api/types'

export interface CollectionsService {
  getMine(): Promise<Collection[]>
  create(input: CreateCollectionInput): Promise<Collection>
  update(id: number, input: UpdateCollectionInput): Promise<Collection>
  remove(id: number): Promise<void>
  getPublic(ownerId: number): Promise<Collection[]>
  share(id: number): Promise<ShareCollectionResponse>
  getPublicCatalogByToken(token: string): Promise<PublicCatalogResponse>
}

export class ApiCollectionsService implements CollectionsService {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  getMine(): Promise<Collection[]> {
    return this.http.request<Collection[]>('GET', '/protected/collections', { auth: true })
  }

  create(input: CreateCollectionInput): Promise<Collection> {
    return this.http.request<Collection>('POST', '/protected/collections', { auth: true, body: input })
  }

  async update(id: number, input: UpdateCollectionInput): Promise<Collection> {
    return this.http.request<Collection>('PUT', `/protected/collections/${id}`, { auth: true, body: input })
  }

  async remove(id: number): Promise<void> {
    await this.http.request<void>('DELETE', `/protected/collections/${id}`, { auth: true })
  }

  getPublic(ownerId: number): Promise<Collection[]> {
    return this.http.request<Collection[]>('GET', '/public/collections', {
      query: { owner_id: ownerId },
    })
  }

  share(id: number): Promise<ShareCollectionResponse> {
    return this.http.request<ShareCollectionResponse>('POST', `/protected/collections/${id}/share`, { auth: true })
  }

  getPublicCatalogByToken(token: string): Promise<PublicCatalogResponse> {
    return this.http.request<PublicCatalogResponse>('GET', `/public/catalogs/${encodeURIComponent(token)}`)
  }
}
