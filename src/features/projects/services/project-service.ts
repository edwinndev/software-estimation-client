import { Project } from "../types/project-types"
import { ProjectFormValues } from "../schemas/project-schema"
import { QueryRequest, PaginatedResponse, FilterOperator } from "@/types/api"
import { paginateQuery } from "@/lib/pagination"
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import { authService } from "@/features/auth/services/auth-service"

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

const matchesFilter = (
  project: Project,
  filter: { key: string; operator: string; values: string[] }
) => {
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
    const filtered = projects.filter((p) => p.id !== id)
    writeJson(STORAGE_KEYS.PROJECTS, filtered)
  },
}
