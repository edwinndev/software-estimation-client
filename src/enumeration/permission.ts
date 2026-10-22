export const Permission = {
  USER_READ: {
    value: "user:read",
    label: "Ver usuarios",
  },
  USER_WRITE: {
    value: "user:write",
    label: "Crear y editar usuarios",
  },
  USER_DELETE: {
    value: "user:delete",
    label: "Eliminar usuarios",
  },
  PROFILE_READ: {
    value: "profile:read",
    label: "Ver perfiles técnicos",
  },
  PROFILE_WRITE: {
    value: "profile:write",
    label: "Crear y editar perfiles técnicos",
  },
  PROJECT_READ: {
    value: "project:read",
    label: "Ver proyectos",
  },
  PROJECT_WRITE: {
    value: "project:write",
    label: "Crear y editar proyectos",
  },
  ESTIMATION_READ: {
    value: "estimation:read",
    label: "Ver estimación",
  },
  ESTIMATION_WRITE: {
    value: "estimation:write",
    label: "Editar estimación",
  },
  COST_READ: {
    value: "cost:read",
    label: "Ver costos",
  },
  COST_WRITE: {
    value: "cost:write",
    label: "Editar costos",
  },
  RISK_READ: {
    value: "risk:read",
    label: "Ver riesgos",
  },
  RISK_WRITE: {
    value: "risk:write",
    label: "Editar riesgos",
  },
  REPORT_READ: {
    value: "report:read",
    label: "Ver reportes",
  },
  HISTORY_READ: {
    value: "history:read",
    label: "Ver historial",
  },
} as const

export const PERMISSIONS = {
  USER_READ: Permission.USER_READ.value,
  USER_WRITE: Permission.USER_WRITE.value,
  USER_DELETE: Permission.USER_DELETE.value,
  PROFILE_READ: Permission.PROFILE_READ.value,
  PROFILE_WRITE: Permission.PROFILE_WRITE.value,
  PROJECT_READ: Permission.PROJECT_READ.value,
  PROJECT_WRITE: Permission.PROJECT_WRITE.value,
  ESTIMATION_READ: Permission.ESTIMATION_READ.value,
  ESTIMATION_WRITE: Permission.ESTIMATION_WRITE.value,
  COST_READ: Permission.COST_READ.value,
  COST_WRITE: Permission.COST_WRITE.value,
  RISK_READ: Permission.RISK_READ.value,
  RISK_WRITE: Permission.RISK_WRITE.value,
  REPORT_READ: Permission.REPORT_READ.value,
  HISTORY_READ: Permission.HISTORY_READ.value,
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const PATH_PERMISSIONS: {
  prefix: string
  permission: PermissionCode
}[] = [
  { prefix: "/users", permission: PERMISSIONS.USER_READ },
  { prefix: "/profiles", permission: PERMISSIONS.PROFILE_READ },
  { prefix: "/projects", permission: PERMISSIONS.PROJECT_READ },
]
