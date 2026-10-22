import { apiClient } from "@/lib/api"
import type { QueryRequest } from "@/types/api"
import type { User } from "@/features/auth/types"
import type {
  CreateUser,
  CreateUserResponse,
  GetUserResponse,
  UpdateUser,
  UpdateUserResponse,
  UpdateUserStatus,
  UpdateUserStatusResponse,
  UserSearchResponse,
} from "../types"

const getUsers = (query: QueryRequest) =>
  apiClient.post<UserSearchResponse>("/api/v1/users/search", query)

const getUser = (userId: string) =>
  apiClient.get<GetUserResponse>(`/api/v1/users/${userId}`)

const createUser = (input: CreateUser) =>
  apiClient.post<CreateUserResponse>("/api/v1/users", input)

const updateUser = ({ userId, ...body }: UpdateUser) =>
  apiClient.put<UpdateUserResponse>(`/api/v1/users/${userId}`, body)

const updateUserStatus = ({ userId, isActive }: UpdateUserStatus) =>
  apiClient.patch<UpdateUserStatusResponse>(`/api/v1/users/${userId}/status`, {
    isActive,
  })

const deleteUser = (userId: string) =>
  apiClient.delete(`/api/v1/users/${userId}`)

const resendInvitation = (userId: string) =>
  apiClient.post<{ message: string }>(
    `/api/v1/users/${userId}/resend-invitation`
  )

const uploadAvatar = (userId: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return apiClient.request<User>(`/api/v1/users/${userId}/avatar`, {
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
