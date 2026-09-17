import { projectService } from "@/features/projects/services/project-service"
import { reportsService } from "./reports.service"
import {
  GlobalSystemReport,
  ProjectReportSummary,
  ReportSnapshot,
} from "../types"

export const globalReportsService = {
  getGlobalSystemReport: async (): Promise<GlobalSystemReport> => {
    // 1. Fetch all projects
    const allProjects = await projectService.getProjects()

    // 2. Fetch the latest estimate for each project
    const projectSummaries: ProjectReportSummary[] = []

    let totalSystemStoryPoints = 0
    let totalSystemBaseTime = 0
    let totalSystemBaseCost = 0
    let totalSystemContingencyCost = 0
    let totalSystemCost = 0
    let totalEstimatesCompleted = 0

    for (const project of allProjects) {
      let latestEstimate = null

      try {
        // Obtenemos la estimación más reciente (al vuelo basado en lo guardado)
        latestEstimate = await reportsService.getLatestEstimate(project.id)

        // Si hay un reporte válido (por ejemplo, puntos > 0 o costo > 0)
        if (
          latestEstimate.totalCost > 0 ||
          latestEstimate.baseEffortPoints > 0
        ) {
          totalEstimatesCompleted++
          totalSystemStoryPoints += latestEstimate.baseEffortPoints

          // Normalizamos el tiempo a días de forma simulada si fuesen semanas
          const timeInDays =
            latestEstimate.timeUnit === "semanas"
              ? latestEstimate.baseTime * 5
              : latestEstimate.baseTime

          totalSystemBaseTime += timeInDays
          totalSystemBaseCost += latestEstimate.baseCost
          totalSystemContingencyCost += latestEstimate.contingencyCost
          totalSystemCost += latestEstimate.totalCost
        } else {
          latestEstimate = null
        }
      } catch (error) {
        // En caso de fallar, se ignora la suma para este proyecto
      }

      projectSummaries.push({
        projectId: project.id,
        projectName: project.nombre,
        projectStatus: project.estado,
        latestEstimate,
      })
    }

    return {
      totalProjects: allProjects.length,
      totalEstimatesCompleted,
      totalSystemStoryPoints,
      totalSystemBaseTime,
      totalSystemBaseCost,
      totalSystemContingencyCost,
      totalSystemCost,
      projectSummaries,
    }
  },

  getGlobalHistory: async (): Promise<
    (ReportSnapshot & { projectName: string })[]
  > => {
    const allProjects = await projectService.getProjects()
    let globalHistory: (ReportSnapshot & { projectName: string })[] = []

    for (const project of allProjects) {
      try {
        const history = await reportsService.getHistory(project.id)
        const mapped = history.map((h) => ({
          ...h,
          projectName: project.nombre,
        }))
        globalHistory = [...globalHistory, ...mapped]
      } catch (e) {
        // ignore
      }
    }

    return globalHistory.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },
}
