import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import { EstimationImpact, RiskConfig, RiskLevel } from "../types"

const DEFAULT_MARGINS: Record<RiskLevel, number> = {
  low: 5,
  medium: 15,
  high: 25,
}

const DEFAULT_CONFIG: RiskConfig = {
  level: "medium",
  contingencyMargin: 15,
}

const storageKey = (projectId: string) => `risk_config_${projectId}`

export const riskService = {
  getDefaultMargin: (level: RiskLevel): number => {
    return DEFAULT_MARGINS[level]
  },

  getConfig: async (projectId: string): Promise<RiskConfig> => {
    if (typeof window === "undefined") {
      return DEFAULT_CONFIG
    }

    const raw = window.localStorage.getItem(storageKey(projectId))
    if (!raw) {
      return DEFAULT_CONFIG
    }

    try {
      const parsed = JSON.parse(raw) as RiskConfig
      const level: RiskLevel =
        parsed.level === "low" ||
        parsed.level === "medium" ||
        parsed.level === "high"
          ? parsed.level
          : DEFAULT_CONFIG.level
      return {
        level,
        contingencyMargin:
          typeof parsed.contingencyMargin === "number"
            ? parsed.contingencyMargin
            : DEFAULT_CONFIG.contingencyMargin,
      }
    } catch {
      return DEFAULT_CONFIG
    }
  },

  calculateImpact: (
    baseTime: number,
    baseCost: number,
    margin: number
  ): EstimationImpact => {
    const factor = margin / 100
    const contingencyTime = baseTime * factor
    const contingencyCost = baseCost * factor

    return {
      originalTime: baseTime,
      originalCost: baseCost,
      contingencyTime,
      contingencyCost,
      totalTime: baseTime + contingencyTime,
      totalCost: baseCost + contingencyCost,
    }
  },

  saveConfig: async (
    projectId: string,
    config: RiskConfig
  ): Promise<RiskConfig> => {
    await requireProjectAction(projectId, "editRisks")
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey(projectId), JSON.stringify(config))
    }
    return config
  },
}
