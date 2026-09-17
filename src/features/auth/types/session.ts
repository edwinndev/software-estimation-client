import { getRolePermissions } from "../constants/permissions"
import { canAccessPath as canAccessGrantedPath } from "../utils/permission-utils"
import type { UserRoleValue } from "./role"

export type Session = {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: UserRoleValue
}

export const canAccessPath = (role: UserRoleValue, pathname: string) =>
  canAccessGrantedPath(getRolePermissions(role), pathname)
