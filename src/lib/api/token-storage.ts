import { readJson, removeJson, writeJson } from "@/lib/storage"

const AUTH_TOKENS_KEY = "software-estimation:auth-tokens"

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
}

export const readAuthTokens = (): AuthTokens | null =>
  readJson<AuthTokens>(AUTH_TOKENS_KEY)

export const writeAuthTokens = (tokens: AuthTokens) => {
  writeJson(AUTH_TOKENS_KEY, tokens)
}

export const clearAuthTokens = () => {
  removeJson(AUTH_TOKENS_KEY)
}

export const getAccessToken = () => readAuthTokens()?.accessToken ?? null

export const getRefreshToken = () => readAuthTokens()?.refreshToken ?? null
