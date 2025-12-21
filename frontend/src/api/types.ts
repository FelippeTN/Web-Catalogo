export type Collection = {
  id: number
  owner_id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export type Product = {
  id: number
  owner_id: number
  collection_id: number | null
  name: string
  description: string
  price: number
  created_at: string
  updated_at: string
}

export type CreateCollectionInput = {
  name: string
  description?: string
}

export type UpdateCollectionInput = {
  name?: string
  description?: string
}

export type CreateProductInput = {
  name: string
  description: string
  price: number
  collection_id?: number | null
}
