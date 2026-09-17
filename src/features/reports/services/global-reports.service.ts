import { projectService } from "@/features/projects/services/project-service"
import { toCalendarDays } from "@/lib/calendar-time"
import type { GlobalSystemReport, ProjectReportSummary } from "../types"
import { reportsService } from "./reports.service"

export const globalReportsService = {
  getGlobalSystemReport: async (): Promise<GlobalSystemReport> => {
    const allProjects = await projectService.getProjects()
    const projectSummaries: ProjectReportSummary[] = []
    let totalSystemStoryPoints = 0
    let totalSystemBaseTime = 0
    let totalSystemBaseCost = 0
    let totalSystemContingencyCost = 0
    let totalSystemCost = 0
    let totalEstimatesCompleted = 0

    for (const project of allProjects) {
      const latestEstimate = await reportsService.getLatestEstimate(project.id)
      const hasEstimate =
        latestEstimate.totalCost > 0 || latestEstimate.baseEffortPoints > 0

      if (hasEstimate) {
        totalEstimatesCompleted += 1
        totalSystemStoryPoints += latestEstimate.baseEffortPoints
        totalSystemBaseTime += toCalendarDays(
          latestEstimate.baseTime,
          latestEstimate.timeUnit
        )
        totalSystemBaseCost += latestEstimate.baseCost
        totalSystemContingencyCost += latestEstimate.contingencyCost
        totalSystemCost += latestEstimate.totalCost
      }

      projectSummaries.push({
        projectId: project.id,
        projectName: project.nombre,
        projectStatus: project.estado,
        projectType: project.tipo,
        latestEstimate: hasEstimate ? latestEstimate : null,
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
}
