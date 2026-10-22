export {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
  isProjectStatus,
  toProjectStatus,
  type ProjectStatus,
  type ProjectStatusBadgeVariant,
} from "@/enumeration/project-status"

export type ProjectAction =
  | "editGeneral"
  | "editBacklog"
  | "editEstimation"
  | "editRisks"
  | "saveReport"
  | "deleteProject"
