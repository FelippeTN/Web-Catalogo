import { API_BASE_URL, joinUrl } from './config'
import { ApiError } from './errors'
import type { TokenStore } from './tokenStore'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface HttpClient {
  request<TResponse>(
    method: HttpMethod,
    path: string,
    options?: {
      query?: Record<string, string | number | boolean | null | undefined>
      body?: unknown
      auth?: boolean
      headers?: Record<string, string>
    },
  ): Promise<TResponse>
}

function buildQueryString(query: Record<string, string | number | boolean | null | undefined>): string {
  const params = new URLSearchParams()
  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === null || rawValue === undefined) continue
    params.set(key, String(rawValue))
  }
  const s = params.toString()
  return s ? `?${s}` : ''
}

export class FetchHttpClient implements HttpClient {
  private readonly tokenStore: TokenStore
  private readonly baseUrl: string

  constructor(tokenStore: TokenStore, baseUrl: string = API_BASE_URL) {
    this.tokenStore = tokenStore
    this.baseUrl = baseUrl
  }

  async request<TResponse>(
    method: HttpMethod,
    path: string,
    options?: {
      query?: Record<string, string | number | boolean | null | undefined>
      body?: unknown
      auth?: boolean
      headers?: Record<string, string>
    },
  ): Promise<TResponse> {
    const url = joinUrl(this.baseUrl, path) + (options?.query ? buildQueryString(options.query) : '')

    const headers: Record<string, string> = {
      ...(options?.headers ?? {}),
    }

    const hasBody = options?.body !== undefined
    if (hasBody) headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'

    if (options?.auth) {
      const token = this.tokenStore.getToken()
      if (token) headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(options?.body) : undefined,
    })

    const contentType = response.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')

    const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)

    if (!response.ok) {
      const message =
        (body && typeof body === 'object' && 'error' in (body as any) && String((body as any).error)) ||
        `Request failed (${response.status})`
      throw new ApiError(message, response.status, body)
    }

    return body as TResponse
  }
}
