import type { UserRoleValue } from "@/features/auth/types"

export type UpdateUser = {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: UserRoleValue
  password: string
}
