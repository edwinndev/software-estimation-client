import { apiClient } from "@/lib/api"
import type { QueryRequest } from "@/types/api"
import type { MessageResponse, UserResponse } from "@/features/auth/types"
import type {
  CreateUserRequest,
  ToggleUserStatusPayload,
  UpdateUserPayload,
  UserSearchResponse,
} from "../types"

const getUsers = (query: QueryRequest) =>
  apiClient.post<UserSearchResponse>("/api/v1/users/search", query)

const getUser = (userId: string) =>
  apiClient.get<UserResponse>(`/api/v1/users/${userId}`)

const createUser = (input: CreateUserRequest) =>
  apiClient.post<UserResponse>("/api/v1/users", input)

const updateUser = ({ userId, ...body }: UpdateUserPayload) =>
  apiClient.put<UserResponse>(`/api/v1/users/${userId}`, body)

const updateUserStatus = ({ userId, isActive }: ToggleUserStatusPayload) =>
  apiClient.patch<UserResponse>(`/api/v1/users/${userId}/status`, {
    isActive,
  })

const deleteUser = (userId: string) =>
  apiClient.delete(`/api/v1/users/${userId}`)

const resendInvitation = (userId: string) =>
  apiClient.post<MessageResponse>(
    `/api/v1/users/${userId}/resend-invitation`
  )

const uploadAvatar = (userId: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return apiClient.request<UserResponse>(`/api/v1/users/${userId}/avatar`, {
    method: "PUT",
    formData,
  })
}

const deleteAvatar = (userId: string) =>
  apiClient.delete(`/api/v1/users/${userId}/avatar`)

export const usersService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  resendInvitation,
  uploadAvatar,
  deleteAvatar,
}
