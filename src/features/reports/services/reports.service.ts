import { calculateSprintsAndProjectTime } from "@/features/estimates/services/sprint-calculation.service"
import { riskService } from "@/features/risks/services/risk-service"
import { RiskConfig } from "@/features/risks/types"
import { ReportSnapshot } from "../types"

const REPORTS_HISTORY_KEY = "reports_history"

export const reportsService = {
  getLatestEstimate: async (projectId: string): Promise<ReportSnapshot> => {
    // 1. Get base estimate (time and effort)
    const estimate = await calculateSprintsAndProjectTime(projectId)

    // Default or mocked cost calculation (until costs service is fully linked)
    // Assuming 1 unit of time (e.g., dia) costs around 150
    const mockRatePerUnit = 150
    const baseCost = estimate.totalBaseTime * mockRatePerUnit

    // 2. Get risk config
    const savedRiskConfig =
      typeof window !== "undefined"
        ? localStorage.getItem(`risk_config_${projectId}`)
        : null

    let riskLevel: "low" | "medium" | "high" = "medium"
    if (savedRiskConfig) {
      try {
        const parsed = JSON.parse(savedRiskConfig) as RiskConfig
        if (parsed.level) {
          riskLevel = parsed.level
        }
      } catch (e) {
        // ignore
      }
    }

    const contingencyMargin = riskService.getDefaultMargin(riskLevel)

    // 3. Calculate impact
    const impact = riskService.calculateImpact(
      estimate.totalBaseTime,
      baseCost,
      contingencyMargin
    )

    return {
      id: crypto.randomUUID(),
      projectId,
      createdAt: new Date().toISOString(),

      baseEffortPoints: estimate.totalStoryPoints,
      baseTime: estimate.totalBaseTime,
      timeUnit: estimate.sprintUnit || "dias",
      baseCost: impact.originalCost,

      riskLevel,
      contingencyMarginPercentage: contingencyMargin,

      contingencyTime: impact.contingencyTime,
      contingencyCost: impact.contingencyCost,

      totalTime: impact.totalTime,
      totalCost: impact.totalCost,
    }
  },

  getHistory: async (projectId: string): Promise<ReportSnapshot[]> => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(`${REPORTS_HISTORY_KEY}_${projectId}`)
    return data ? JSON.parse(data) : []
  },

  saveSnapshot: async (snapshot: ReportSnapshot): Promise<void> => {
    if (typeof window === "undefined") return
    const current = await reportsService.getHistory(snapshot.projectId)
    const updated = [snapshot, ...current]
    localStorage.setItem(
      `${REPORTS_HISTORY_KEY}_${snapshot.projectId}`,
      JSON.stringify(updated)
    )
  },
}
