export type PasswordReset = {
  email: string
  code: string
  expiresAt: number
  verified: boolean
}
