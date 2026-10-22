import type { UserRoleValue } from "@/enumeration/user-role"

export type Session = {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: UserRoleValue
  roleId: string
  roleName: string
  permissions: string[]
}
