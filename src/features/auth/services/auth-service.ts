import { apiClient } from "@/lib/api"
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  RefreshTokenRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UserResponse,
  VerifyResetCodeRequest,
} from "../types"

const login = (input: LoginRequest) =>
  apiClient.post<AuthResponse>("/api/v1/auth/login", input, { auth: false })

const logout = (body?: LogoutRequest) =>
  apiClient.post<MessageResponse>("/api/v1/auth/logout", body)

const refreshToken = (body: RefreshTokenRequest) =>
  apiClient.post<AuthResponse>("/api/v1/auth/refresh-token", body, {
    auth: false,
  })

const getProfile = () => apiClient.get<UserResponse>("/api/v1/auth/me")

const updateProfile = (input: UpdateProfileRequest) =>
  apiClient.put<UserResponse>("/api/v1/auth/me", input)

const changePassword = (input: ChangePasswordRequest) =>
  apiClient.put<MessageResponse>("/api/v1/auth/change-password", input)

const requestPasswordReset = (input: RequestPasswordResetRequest) =>
  apiClient.post<MessageResponse>(
    "/api/v1/auth/password-reset/request",
    input,
    { auth: false }
  )

const verifyResetCode = (input: VerifyResetCodeRequest) =>
  apiClient.post<MessageResponse>(
    "/api/v1/auth/password-reset/verify",
    input,
    { auth: false }
  )

const resetPassword = (input: ResetPasswordRequest) =>
  apiClient.post<MessageResponse>(
    "/api/v1/auth/password-reset/reset",
    input,
    { auth: false }
  )

export const authService = {
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
}
