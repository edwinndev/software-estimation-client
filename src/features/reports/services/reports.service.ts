import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import { getProjectCostSummary } from "@/features/costs/services/costs-service"
import { calculateSprintsAndProjectTime } from "@/features/estimates/services/sprint-calculation.service"
import { projectService } from "@/features/projects/services/project-service"
import { riskService } from "@/features/risks/services/risk-service"
import { roundMoney } from "@/lib/format"
import type { ReportSnapshot } from "../types"
import { emptySnapshot, normalizeSnapshot } from "../utils/normalize-snapshot"

const REPORTS_HISTORY_KEY = "reports_history"

const historyKey = (projectId: string) => `${REPORTS_HISTORY_KEY}_${projectId}`

export const reportsService = {
  getLatestEstimate: async (projectId: string): Promise<ReportSnapshot> => {
    const estimate = await calculateSprintsAndProjectTime(projectId)
    const costs = await getProjectCostSummary(projectId)
    const risk = await riskService.getConfig(projectId)
    const project = await projectService.getProject(projectId)
    const impact = riskService.calculateImpact(
      estimate.totalBaseTime,
      costs.totalCost,
      risk.contingencyMargin
    )

    return {
      id: crypto.randomUUID(),
      projectId,
      projectName: project ? project.nombre : "",
      projectStatus: project ? project.estado : "",
      projectType: project ? project.tipo : "",
      projectOwner: project ? project.responsable : "",
      createdAt: new Date().toISOString(),
      baseEffortPoints: estimate.totalStoryPoints,
      totalSprints: estimate.totalSprints,
      totalEffortHours: estimate.totalEffortHours,
      storiesTotal: estimate.storiesTotal,
      storiesWithPoints: estimate.storiesWithPoints,
      tasksTotal: estimate.tasksTotal,
      tasksWithHours: estimate.tasksWithHours,
      baseTime: estimate.totalBaseTime,
      timeUnit: estimate.sprintUnit,
      baseCost: roundMoney(impact.originalCost),
      riskLevel: risk.level,
      contingencyMarginPercentage: risk.contingencyMargin,
      contingencyTime: Number(impact.contingencyTime.toFixed(2)),
      contingencyCost: roundMoney(impact.contingencyCost),
      totalTime: Number(impact.totalTime.toFixed(2)),
      totalCost: roundMoney(impact.totalCost),
    }
  },

  getHistory: async (projectId: string): Promise<ReportSnapshot[]> => {
    if (typeof window === "undefined") {
      return []
    }
    const data = window.localStorage.getItem(historyKey(projectId))
    if (!data) {
      return []
    }
    try {
      const parsed = JSON.parse(data) as unknown
      if (!Array.isArray(parsed)) {
        return []
      }
      return parsed.map((item) => normalizeSnapshot(item, projectId))
    } catch {
      return []
    }
  },

  saveSnapshot: async (snapshot: ReportSnapshot): Promise<void> => {
    await requireProjectAction(snapshot.projectId, "saveReport")
    if (typeof window === "undefined") {
      return
    }
    const current = await reportsService.getHistory(snapshot.projectId)
    const stored: ReportSnapshot = {
      ...snapshot,
      id: snapshot.id.length > 0 ? snapshot.id : crypto.randomUUID(),
      createdAt:
        snapshot.createdAt.length > 0
          ? snapshot.createdAt
          : new Date().toISOString(),
    }
    window.localStorage.setItem(
      historyKey(snapshot.projectId),
      JSON.stringify([stored, ...current])
    )
  },

  emptySnapshot,
}
