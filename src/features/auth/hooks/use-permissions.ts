import {
  PERMISSIONS,
  getRolePermissions,
  type PermissionCode,
} from "../constants/permissions"
import {
  canAccessPath,
  hasAllPermissions as hasAllGranted,
  hasAnyPermission as hasAnyGranted,
  hasPermission as isGranted,
} from "../utils/permission-utils"
import { useSession } from "./use-session"

export const usePermissions = () => {
  const { data: session } = useSession()
  const permissions = session ? getRolePermissions(session.role) : []

  return {
    permissions,
    hasPermission: (code: PermissionCode) => isGranted(permissions, code),
    hasAnyPermission: (codes: PermissionCode[]) =>
      hasAnyGranted(permissions, codes),
    hasAllPermissions: (codes: PermissionCode[]) =>
      hasAllGranted(permissions, codes),
    canAccessPath: (pathname: string) => canAccessPath(permissions, pathname),
    canReadUsers: isGranted(permissions, PERMISSIONS.USER_READ),
    canWriteUsers: isGranted(permissions, PERMISSIONS.USER_WRITE),
    canDeleteUsers: isGranted(permissions, PERMISSIONS.USER_DELETE),
    canReadProfiles: isGranted(permissions, PERMISSIONS.PROFILE_READ),
  }
}
