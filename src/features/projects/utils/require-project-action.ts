import { projectService } from "../services/project-service"
import { toProjectStatus, type ProjectAction } from "../types/project-status"
import {
  canPerformProjectAction,
  getBlockedActionMessage,
} from "./project-permissions"

export const requireProjectAction = async (
  projectId: string,
  action: ProjectAction
) => {
  const project = await projectService.getProject(projectId)
  if (!project) {
    throw new Error("Proyecto no encontrado")
  }

  const status = toProjectStatus(project.estado)
  if (!canPerformProjectAction(status, action)) {
    throw new Error(getBlockedActionMessage(status, action))
  }

  return project
}
