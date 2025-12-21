export interface TokenStore {
  getToken(): string | null
}

export class LocalStorageTokenStore implements TokenStore {
  private readonly key: string

  constructor(key: string = 'token') {
    this.key = key
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.key)
    } catch {
      return null
    }
  }
}
