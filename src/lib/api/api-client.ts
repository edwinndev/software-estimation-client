import { API_BASE_URL } from "./config"
import { ApiError, type ApiErrorBody } from "./api-error"
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  writeAuthTokens,
  type AuthTokens,
} from "./token-storage"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  formData?: FormData
  auth?: boolean
  headers?: HeadersInit
  signal?: AbortSignal
}

type AuthResponsePayload = {
  token: string
  refreshToken: string
  tokenType: string
  expiresInSeconds: number
}

let refreshPromise: Promise<AuthTokens | null> | null = null

const parseErrorBody = async (
  response: Response
): Promise<ApiErrorBody | null> => {
  try {
    return (await response.json()) as ApiErrorBody
  } catch {
    return null
  }
}

const toApiError = async (response: Response) => {
  const body = await parseErrorBody(response)
  const message =
    body?.message?.trim() ||
    `Error ${response.status} al comunicar con el servidor`
  return new ApiError(response.status, message, body)
}

const buildUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const storeTokensFromAuthResponse = (
  payload: AuthResponsePayload
): AuthTokens => {
  const tokens: AuthTokens = {
    accessToken: payload.token,
    refreshToken: payload.refreshToken,
    tokenType: payload.tokenType || "Bearer",
    expiresAt: Date.now() + payload.expiresInSeconds * 1000,
  }
  writeAuthTokens(tokens)
  return tokens
}

const refreshAccessToken = async (): Promise<AuthTokens | null> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    clearAuthTokens()
    return null
  }

  const response = await fetch(buildUrl("/api/v1/auth/refresh-token"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    clearAuthTokens()
    return null
  }

  const payload = (await response.json()) as AuthResponsePayload
  return storeTokensFromAuthResponse(payload)
}

const ensureFreshTokens = async (): Promise<AuthTokens | null> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

const buildHeaders = (
  options: RequestOptions,
  accessToken: string | null
): Headers => {
  const headers = new Headers(options.headers)

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  if (options.body !== undefined && !options.formData) {
    headers.set("Content-Type", "application/json")
  }

  if (options.auth !== false && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  return headers
}

const executeRequest = async <T>(
  path: string,
  options: RequestOptions,
  accessToken: string | null
): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    method: options.method || "GET",
    headers: buildHeaders(options, accessToken),
    body: options.formData
      ? options.formData
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
    signal: options.signal,
  })

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    throw await toApiError(response)
  }

  if (response.status === 200 || response.status === 201) {
    const contentType = response.headers.get("Content-Type") || ""
    if (!contentType.includes("application/json")) {
      return undefined as T
    }
  }

  return (await response.json()) as T
}

export const apiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const requiresAuth = options.auth !== false
    let accessToken = requiresAuth ? getAccessToken() : null

    try {
      return await executeRequest<T>(path, options, accessToken)
    } catch (error) {
      if (
        !(error instanceof ApiError) ||
        error.status !== 401 ||
        !requiresAuth
      ) {
        throw error
      }

      const refreshed = await ensureFreshTokens()
      if (!refreshed) {
        throw error
      }

      accessToken = refreshed.accessToken
      return executeRequest<T>(path, options, accessToken)
    }
  },

  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "GET" })
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(path, { ...options, method: "POST", body })
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(path, { ...options, method: "PUT", body })
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(path, { ...options, method: "PATCH", body })
  },

  delete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "DELETE" })
  },

  storeAuthTokens: storeTokensFromAuthResponse,
  clearAuthTokens,
}

export const apiFetchBlob = async (
  path: string,
  options: Omit<RequestOptions, "body" | "formData"> = {}
) => {
  const requiresAuth = options.auth !== false
  const accessToken = requiresAuth ? getAccessToken() : null

  const doFetch = async (token: string | null) => {
    const response = await fetch(buildUrl(path), {
      method: options.method || "GET",
      headers: buildHeaders(options, token),
      signal: options.signal,
    })

    if (!response.ok) {
      throw await toApiError(response)
    }

    return response.blob()
  }

  try {
    return await doFetch(accessToken)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !requiresAuth) {
      throw error
    }

    const refreshed = await ensureFreshTokens()
    if (!refreshed) {
      throw error
    }

    return doFetch(refreshed.accessToken)
  }
}
