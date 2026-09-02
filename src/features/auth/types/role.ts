import {
  CalculatorIcon,
  EyeIcon,
  ShieldIcon,
  type LucideIcon,
} from "lucide-react"

export type RoleDefinition = {
  value: string
  label: string
  icon: LucideIcon
}

export const UserRole = {
  ADMIN: {
    value: "admin",
    label: "ADMINISTRADOR",
    icon: ShieldIcon,
  },
  ESTIMATOR: {
    value: "estimator",
    label: "ESTIMADOR",
    icon: CalculatorIcon,
  },
  VIEWER: {
    value: "viewer",
    label: "CONSULTOR",
    icon: EyeIcon,
  },
} as const satisfies Record<string, RoleDefinition>

export const USER_ROLES = [
  UserRole.ADMIN.value,
  UserRole.ESTIMATOR.value,
  UserRole.VIEWER.value,
] as const

export type UserRoleValue = (typeof USER_ROLES)[number]

export const ROLE_BY_VALUE = {
  [UserRole.ADMIN.value]: UserRole.ADMIN,
  [UserRole.ESTIMATOR.value]: UserRole.ESTIMATOR,
  [UserRole.VIEWER.value]: UserRole.VIEWER,
}

export const ROLE_OPTIONS = [
  UserRole.ADMIN,
  UserRole.ESTIMATOR,
  UserRole.VIEWER,
]

export const ROLE_ITEM_ICON = ROLE_OPTIONS[0].icon

export const ROLE_LABELS = {
  [UserRole.ADMIN.value]: UserRole.ADMIN.label,
  [UserRole.ESTIMATOR.value]: UserRole.ESTIMATOR.label,
  [UserRole.VIEWER.value]: UserRole.VIEWER.label,
}

export const DEFAULT_USER_ROLE = UserRole.ESTIMATOR.value

export const isUserRole = (value: unknown): value is UserRoleValue =>
  USER_ROLES.some((role) => role === value)
