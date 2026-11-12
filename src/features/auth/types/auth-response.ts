import type { UserResponse } from "./user-response"

export type AuthResponse = {
  token: string
  refreshToken: string
  tokenType: string
  expiresInSeconds: number
  user: UserResponse
  permissions: string[]
}

export type LoginResponse = AuthResponse
