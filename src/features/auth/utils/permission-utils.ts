import { PATH_PERMISSIONS, type PermissionCode } from "../constants/permissions"

export const hasPermission = (granted: string[], required: PermissionCode) =>
  granted.includes(required)

export const hasAnyPermission = (
  granted: string[],
  required: PermissionCode[]
) => required.some((code) => granted.includes(code))

export const hasAllPermissions = (
  granted: string[],
  required: PermissionCode[]
) => required.every((code) => granted.includes(code))

export const getPathPermission = (pathname: string) => {
  const match = PATH_PERMISSIONS.find(
    (item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`)
  )

  return match ? match.permission : null
}

export const canAccessPath = (granted: string[], pathname: string) => {
  const required = getPathPermission(pathname)
  return required ? hasPermission(granted, required) : true
}
