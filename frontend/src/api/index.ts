import { FetchHttpClient } from './httpClient'
import { LocalStorageTokenStore } from './tokenStore'
import { ApiCollectionsService } from './collectionsService'
import { ApiProductsService } from './productsService'

const http = new FetchHttpClient(new LocalStorageTokenStore('token'))

export const collectionsService = new ApiCollectionsService(http)
export const productsService = new ApiProductsService(http)

export * from './types'
export * from './errors'
