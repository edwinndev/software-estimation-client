import { apiClient } from "@/lib/api"
import type {
  AuthResponse,
  ChangePassword,
  LoginInput,
  RequestPasswordReset,
  ResetPassword,
  UpdateProfile,
  User,
  VerifyResetCode,
} from "../types"

const login = (input: LoginInput) =>
  apiClient.post<AuthResponse>("/api/v1/auth/login", input, { auth: false })

const logout = (body?: { refreshToken: string }) =>
  apiClient.post<{ message: string }>("/api/v1/auth/logout", body)

const getProfile = () => apiClient.get<User>("/api/v1/auth/me")

const updateProfile = (input: UpdateProfile) =>
  apiClient.put<User>("/api/v1/auth/me", input)

const changePassword = (input: ChangePassword) =>
  apiClient.put<{ message: string }>("/api/v1/auth/change-password", input)

const requestPasswordReset = (input: RequestPasswordReset) =>
  apiClient.post<{ message: string }>(
    "/api/v1/auth/password-reset/request",
    input,
    { auth: false }
  )

const verifyResetCode = (input: VerifyResetCode) =>
  apiClient.post<{ message: string }>(
    "/api/v1/auth/password-reset/verify",
    input,
    { auth: false }
  )

const resetPassword = (input: ResetPassword) =>
  apiClient.post<{ message: string }>(
    "/api/v1/auth/password-reset/reset",
    input,
    { auth: false }
  )

export const authService = {
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
}
