import type { UserRoleValue } from "@/features/auth/types"

export type CreateUser = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRoleValue
}
