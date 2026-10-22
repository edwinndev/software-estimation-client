import {
  CalculatorIcon,
  EyeIcon,
  ShieldIcon,
  type LucideIcon,
} from "lucide-react"

export type UserRoleDefinition = {
  value: string
  label: string
  icon: LucideIcon
  color: string
}

export const UserRole = {
  ADMIN: {
    value: "admin",
    label: "ADMINISTRADOR",
    icon: ShieldIcon,
    color: "text-violet-600",
  },
  ESTIMATOR: {
    value: "estimator",
    label: "ESTIMADOR",
    icon: CalculatorIcon,
    color: "text-sky-600",
  },
  VIEWER: {
    value: "viewer",
    label: "CONSULTOR",
    icon: EyeIcon,
    color: "text-slate-600",
  },
} as const satisfies Record<string, UserRoleDefinition>

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
} as const

export const ROLE_OPTIONS = [
  UserRole.ADMIN,
  UserRole.ESTIMATOR,
  UserRole.VIEWER,
]

export const ROLE_ITEM_ICON = UserRole.ADMIN.icon

export const ROLE_LABELS = {
  [UserRole.ADMIN.value]: UserRole.ADMIN.label,
  [UserRole.ESTIMATOR.value]: UserRole.ESTIMATOR.label,
  [UserRole.VIEWER.value]: UserRole.VIEWER.label,
} as const

export const DEFAULT_USER_ROLE = UserRole.ESTIMATOR.value

export const isUserRole = (value: unknown): value is UserRoleValue =>
  USER_ROLES.some((role) => role === value)
