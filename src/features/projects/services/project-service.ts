import { Project } from "../types/project-types"
import { ProjectFormValues } from "../schemas/project-schema"

const LOCAL_STORAGE_KEY = "software_estimation_projects"

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  createProject: async (data: ProjectFormValues): Promise<Project> => {
    // Simulamos un retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    const projects = await projectService.getProjects()

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
    }

    projects.push(newProject)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects))

    return newProject
  },
}
