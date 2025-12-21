import type { HttpClient } from './httpClient'
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from './types'

export interface CollectionsService {
  getMine(): Promise<Collection[]>
  create(input: CreateCollectionInput): Promise<Collection>
  update(id: number, input: UpdateCollectionInput): Promise<Collection>
  remove(id: number): Promise<void>
  getPublic(ownerId: number): Promise<Collection[]>
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
}
