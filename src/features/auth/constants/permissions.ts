import { UserRole, type UserRoleValue } from "../types/role"

export const PERMISSIONS = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  USER_DELETE: "user:delete",
  PROFILE_READ: "profile:read",
  PROFILE_WRITE: "profile:write",
  PROJECT_READ: "project:read",
  PROJECT_WRITE: "project:write",
  ESTIMATION_READ: "estimation:read",
  ESTIMATION_WRITE: "estimation:write",
  COST_READ: "cost:read",
  COST_WRITE: "cost:write",
  RISK_READ: "risk:read",
  RISK_WRITE: "risk:write",
  REPORT_READ: "report:read",
  HISTORY_READ: "history:read",
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

export const ROLE_PERMISSIONS: Record<UserRoleValue, PermissionCode[]> = {
  [UserRole.ADMIN.value]: ALL_PERMISSIONS,
  [UserRole.ESTIMATOR.value]: [
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_WRITE,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_WRITE,
    PERMISSIONS.ESTIMATION_READ,
    PERMISSIONS.ESTIMATION_WRITE,
    PERMISSIONS.COST_READ,
    PERMISSIONS.COST_WRITE,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.RISK_WRITE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.HISTORY_READ,
  ],
  [UserRole.VIEWER.value]: [
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.ESTIMATION_READ,
    PERMISSIONS.COST_READ,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.HISTORY_READ,
  ],
}

export const PATH_PERMISSIONS: {
  prefix: string
  permission: PermissionCode
}[] = [
  { prefix: "/users", permission: PERMISSIONS.USER_READ },
  { prefix: "/profiles", permission: PERMISSIONS.PROFILE_READ },
  { prefix: "/projects", permission: PERMISSIONS.PROJECT_READ },
]

export const getRolePermissions = (role: UserRoleValue) =>
  ROLE_PERMISSIONS[role]
