export const PROJECT_STATUSES = [
  "borrador",
  "en_evaluacion",
  "estimado",
  "aprobado",
  "rechazado",
  "en_ejecucion",
  "finalizado",
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export type ProjectAction =
  | "editGeneral"
  | "editBacklog"
  | "editEstimation"
  | "editRisks"
  | "saveReport"
  | "deleteProject"

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  borrador: "Borrador",
  en_evaluacion: "En evaluación",
  estimado: "Estimado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  en_ejecucion: "En ejecución",
  finalizado: "Finalizado",
}

export type ProjectStatusBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "muted"
  | "success"
  | "warning"
  | "info"

export const PROJECT_STATUS_VARIANTS: Record<
  ProjectStatus,
  ProjectStatusBadgeVariant
> = {
  borrador: "muted",
  en_evaluacion: "warning",
  estimado: "info",
  aprobado: "success",
  rechazado: "destructive",
  en_ejecucion: "default",
  finalizado: "secondary",
}

export const isProjectStatus = (value: string): value is ProjectStatus =>
  PROJECT_STATUSES.some((status) => status === value)

export const toProjectStatus = (value: string): ProjectStatus =>
  isProjectStatus(value) ? value : "borrador"
