import {
  PROJECT_STATUS_LABELS,
  type ProjectAction,
  type ProjectStatus,
} from "../types/project-status"

const TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  borrador: ["en_evaluacion"],
  en_evaluacion: ["borrador", "estimado"],
  estimado: ["en_evaluacion", "aprobado", "rechazado"],
  aprobado: ["en_ejecucion"],
  rechazado: ["borrador", "en_evaluacion"],
  en_ejecucion: ["finalizado"],
  finalizado: [],
}

const HINTS: Record<ProjectStatus, string> = {
  borrador:
    "Puedes editar los datos generales y el backlog. Pásalo a evaluación para estimar.",
  en_evaluacion:
    "Puedes estimar, ajustar horas, riesgos y guardar reportes. El alcance aún se puede corregir.",
  estimado:
    "La estimación quedó cerrada. Aprueba o rechaza el proyecto, o vuelve a evaluación.",
  aprobado:
    "El proyecto fue aprobado. Puedes pasarlo a ejecución y consultar reportes.",
  rechazado:
    "El proyecto fue rechazado. Vuelve a borrador o evaluación para corregirlo.",
  en_ejecucion:
    "El proyecto está en ejecución. Solo consulta y reportes. Al terminar, ciérralo.",
  finalizado: "El proyecto está cerrado. Solo se puede consultar.",
}

export const getAllowedTransitions = (status: ProjectStatus): ProjectStatus[] =>
  TRANSITIONS[status]

export const canTransitionStatus = (
  from: ProjectStatus,
  to: ProjectStatus
): boolean => from === to || TRANSITIONS[from].includes(to)

export const canEditGeneral = (status: ProjectStatus) =>
  status === "borrador" || status === "rechazado"

export const canEditBacklog = (status: ProjectStatus) =>
  status === "borrador" || status === "en_evaluacion" || status === "rechazado"

export const canEditEstimation = (status: ProjectStatus) =>
  status === "en_evaluacion"

export const canEditRisks = (status: ProjectStatus) =>
  status === "en_evaluacion"

export const canSaveReport = (status: ProjectStatus) =>
  status === "en_evaluacion" ||
  status === "estimado" ||
  status === "aprobado" ||
  status === "en_ejecucion"

export const canDeleteProject = (status: ProjectStatus) =>
  status === "borrador" || status === "rechazado"

export const canPerformProjectAction = (
  status: ProjectStatus,
  action: ProjectAction
): boolean => {
  if (action === "editGeneral") {
    return canEditGeneral(status)
  }
  if (action === "editBacklog") {
    return canEditBacklog(status)
  }
  if (action === "editEstimation") {
    return canEditEstimation(status)
  }
  if (action === "editRisks") {
    return canEditRisks(status)
  }
  if (action === "saveReport") {
    return canSaveReport(status)
  }
  return canDeleteProject(status)
}

export const getProjectStatusHint = (status: ProjectStatus) => HINTS[status]

export const getBlockedActionMessage = (
  status: ProjectStatus,
  action: ProjectAction
) => {
  const labels: Record<ProjectAction, string> = {
    editGeneral: "editar los datos del proyecto",
    editBacklog: "modificar historias y tareas",
    editEstimation: "modificar la estimación",
    editRisks: "modificar el riesgo",
    saveReport: "guardar el reporte",
    deleteProject: "eliminar el proyecto",
  }

  return `No puedes ${labels[action]} en estado ${PROJECT_STATUS_LABELS[status]}.`
}

export const getInvalidTransitionMessage = (
  from: ProjectStatus,
  to: ProjectStatus
) =>
  `No puedes pasar de ${PROJECT_STATUS_LABELS[from]} a ${PROJECT_STATUS_LABELS[to]}.`
