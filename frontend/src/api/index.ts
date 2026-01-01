import { FetchHttpClient } from '@/api/httpClient'
import { LocalStorageTokenStore } from '@/api/tokenStore'
import { ApiCollectionsService } from '@/api/collectionsService'
import { ApiProductsService } from '@/api/productsService'

const http = new FetchHttpClient(new LocalStorageTokenStore('token'))

export const collectionsService = new ApiCollectionsService(http)
export const productsService = new ApiProductsService(http)

export * from './types'
export * from './errors'
