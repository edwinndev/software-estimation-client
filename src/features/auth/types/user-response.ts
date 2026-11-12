import type { UserRoleValue } from "@/enumeration/user-role"
import type { FileAttachmentResponse } from "./file-attachment-response"

export type UserResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  roleId: string
  roleCode: UserRoleValue
  roleName: string
  avatar: FileAttachmentResponse | null
  createdAt: string
  updatedAt: string | null
}

export type User = UserResponse

export type UserWithRoleAlias = UserResponse & {
  role: UserRoleValue
}

export const getFullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`.trim()

export const getInitials = (user: { firstName: string; lastName: string }) =>
  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

export const withRoleAlias = (user: UserResponse): UserWithRoleAlias => ({
  ...user,
  role: user.roleCode,
})
