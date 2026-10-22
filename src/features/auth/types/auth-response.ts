import type { User } from "./user"

export type AuthResponse = {
  token: string
  refreshToken: string
  tokenType: string
  expiresInSeconds: number
  user: User
  permissions: string[]
}
