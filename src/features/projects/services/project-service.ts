import { PROJECT_STATUS_LABELS, toProjectStatus } from "../types/project-status"
import {
  canDeleteProject,
  canEditGeneral,
  canTransitionStatus,
  getBlockedActionMessage,
  getInvalidTransitionMessage,
} from "../utils/project-permissions"
import { QueryRequest, PaginatedResponse, FilterOperator } from "@/types/api"
import { paginateQuery } from "@/lib/pagination"
import { readJson, removeJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import { authService } from "@/features/auth/services/auth-service"
import { Project } from "../types/project-types"
import { ProjectFormValues } from "../schemas/project-schema"

const getCurrentUser = async () => {
  const session = await authService.getSession()
  if (session) {
    return {
      id: session.userId,
      name: `${session.firstName} ${session.lastName}`.trim(),
    }
  }
  return { id: "unknown", name: "Usuario Desconocido" }
}

const sortProjects = (projects: Project[], query: QueryRequest) => {
  const { orderBy, sortDirection } = query.pagination

  return [...projects].sort((left, right) => {
    const leftValue = String(left[orderBy as keyof Project] ?? "")
    const rightValue = String(right[orderBy as keyof Project] ?? "")
    const comparison = leftValue.localeCompare(rightValue)

    return sortDirection === "DESC" ? -comparison : comparison
  })
}

const getFieldValue = (project: Project, key: string) => {
  if (key === "search") {
    return `${project.nombre} ${project.descripcion}`.toLowerCase()
  }

  const value = project[key as keyof Project]
  return String(value ?? "").toLowerCase()
}

const matchesDateFilter = (
  project: Project,
  filter: { key: string; operator: string; values: string[] }
) => {
  const fieldValue = project[filter.key as keyof Project]
  if (typeof fieldValue !== "string" || !filter.values[0]) {
    return true
  }

  const fieldTime = new Date(fieldValue).getTime()
  const filterTime = new Date(filter.values[0]).getTime()

  if (Number.isNaN(fieldTime) || Number.isNaN(filterTime)) {
    return true
  }

  if (filter.operator === FilterOperator.GE) {
    return fieldTime >= filterTime
  }

  if (filter.operator === FilterOperator.LE) {
    return fieldTime <= filterTime
  }

  return true
}

const matchesFilter = (
  project: Project,
  filter: { key: string; operator: string; values: string[] }
) => {
  if (filter.key === "fecha_inicio" || filter.key === "fecha_fin") {
    return matchesDateFilter(project, filter)
  }

  const field = getFieldValue(project, filter.key)
  const values = filter.values.map((value) => value.toLowerCase())

  if (filter.operator === FilterOperator.LK) {
    return values.some((value) => field.includes(value))
  }

  if (filter.operator === FilterOperator.EQ) {
    return values.includes(field)
  }

  return true
}

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    return readJson<Project[]>(STORAGE_KEYS.PROJECTS) ?? []
  },

  getProject: async (id: string): Promise<Project | undefined> => {
    const projects = await projectService.getProjects()
    return projects.find((p) => p.id === id)
  },

  searchProjects: async (
    query: QueryRequest
  ): Promise<PaginatedResponse<Project, "projectResponse">> => {
    const projects = await projectService.getProjects()

    const filtered = projects.filter((project) =>
      query.filters.every((filter) => matchesFilter(project, filter))
    )

    return paginateQuery(
      sortProjects(filtered, query),
      query.pagination,
      "projectResponse"
    )
  },

  createProject: async (data: ProjectFormValues): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const projects = await projectService.getProjects()
    const currentUser = await getCurrentUser()

    const newProject: Project = {
      id: crypto.randomUUID(),
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipo: data.tipo,
      fecha_inicio: data.fecha_inicio!.toISOString(),
      fecha_fin: data.fecha_fin!.toISOString(),
      responsable: data.responsable,
      estado: "borrador",
      createdAt: new Date().toISOString(),
      history: [
        {
          id: crypto.randomUUID(),
          previousState: null,
          newState: "borrador",
          changedAt: new Date().toISOString(),
          changedBy: currentUser,
        },
      ],
    }

    projects.push(newProject)
    writeJson(STORAGE_KEYS.PROJECTS, projects)

    return newProject
  },

  updateProject: async (
    id: string,
    data: ProjectFormValues & { estado: string }
  ): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const projects = await projectService.getProjects()
    const index = projects.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Proyecto no encontrado")

    const currentProject = projects[index]
    const currentStatus = toProjectStatus(currentProject.estado)
    const nextStatus = toProjectStatus(data.estado)

    if (!canTransitionStatus(currentStatus, nextStatus)) {
      throw new Error(getInvalidTransitionMessage(currentStatus, nextStatus))
    }

    const generalChanged =
      currentProject.nombre !== data.nombre ||
      currentProject.descripcion !== data.descripcion ||
      currentProject.tipo !== data.tipo ||
      currentProject.responsable !== data.responsable ||
      currentProject.fecha_inicio !== data.fecha_inicio!.toISOString() ||
      currentProject.fecha_fin !== data.fecha_fin!.toISOString()

    if (generalChanged && !canEditGeneral(currentStatus)) {
      throw new Error(
        `No puedes editar los datos del proyecto en estado ${PROJECT_STATUS_LABELS[currentStatus]}.`
      )
    }

    const updatedProject: Project = {
      ...currentProject,
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipo: data.tipo,
      fecha_inicio: data.fecha_inicio!.toISOString(),
      fecha_fin: data.fecha_fin!.toISOString(),
      responsable: data.responsable,
      estado: data.estado,
    }

    if (currentProject.estado !== data.estado) {
      const currentUser = await getCurrentUser()
      updatedProject.history = [
        ...(currentProject.history || []),
        {
          id: crypto.randomUUID(),
          previousState: currentProject.estado,
          newState: data.estado,
          changedAt: new Date().toISOString(),
          changedBy: currentUser,
        },
      ]
    }

    projects[index] = updatedProject
    writeJson(STORAGE_KEYS.PROJECTS, projects)

    return updatedProject
  },

  updateProjectStatus: async (id: string, estado: string): Promise<Project> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const projects = await projectService.getProjects()
    const index = projects.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Proyecto no encontrado")

    const currentProject = projects[index]
    if (currentProject.estado === estado) return currentProject

    const currentStatus = toProjectStatus(currentProject.estado)
    const nextStatus = toProjectStatus(estado)
    if (!canTransitionStatus(currentStatus, nextStatus)) {
      throw new Error(getInvalidTransitionMessage(currentStatus, nextStatus))
    }

    const currentUser = await getCurrentUser()
    const updatedProject: Project = {
      ...currentProject,
      estado,
      history: [
        ...(currentProject.history || []),
        {
          id: crypto.randomUUID(),
          previousState: currentProject.estado,
          newState: estado,
          changedAt: new Date().toISOString(),
          changedBy: currentUser,
        },
      ],
    }
    projects[index] = updatedProject
    writeJson(STORAGE_KEYS.PROJECTS, projects)

    return updatedProject
  },

  deleteProject: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const projects = await projectService.getProjects()
    const current = projects.find((project) => project.id === id)
    if (!current) {
      throw new Error("Proyecto no encontrado")
    }
    if (!canDeleteProject(toProjectStatus(current.estado))) {
      throw new Error(
        getBlockedActionMessage(
          toProjectStatus(current.estado),
          "deleteProject"
        )
      )
    }
    const filtered = projects.filter((p) => p.id !== id)
    writeJson(STORAGE_KEYS.PROJECTS, filtered)
    removeJson(`software-estimation:backlog:${id}`)
    removeJson(`software-estimation:task-hours:${id}`)
    removeJson(`software-estimation:story-points:${id}`)
    removeJson(`software-estimation:sprint-config:${id}`)
    removeJson(`risk_config_${id}`)
    removeJson(`reports_history_${id}`)
  },
}
