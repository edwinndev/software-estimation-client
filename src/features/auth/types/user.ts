import type { UserRoleValue } from "@/enumeration/user-role"
import type { FileAttachment } from "./file-attachment"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  roleId: string
  roleCode: UserRoleValue
  roleName: string
  avatar: FileAttachment | null
  createdAt: string
  updatedAt: string | null
}

/** @deprecated Use `roleCode` — kept for UI helpers that expect `role`. */
export type UserWithRoleAlias = User & {
  role: UserRoleValue
}

export const getFullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`.trim()

export const getInitials = (user: { firstName: string; lastName: string }) =>
  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

export const withRoleAlias = (user: User): UserWithRoleAlias => ({
  ...user,
  role: user.roleCode,
})
