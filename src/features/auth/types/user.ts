import type { UserRoleValue } from "./role"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRoleValue
  isActive: boolean
  createdAt: string
}

export type UserAccount = User & {
  passwordHash: string
}

export const getFullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`.trim()

export const getInitials = (user: { firstName: string; lastName: string }) =>
  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
