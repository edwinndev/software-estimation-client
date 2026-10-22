import {
  DEFAULT_RISK_LEVEL,
  getRiskDefaultMargin,
  isRiskLevel,
  type RiskLevel,
} from "@/enumeration/risk-level"
import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import type { EstimationImpact, RiskConfig } from "../types"

const DEFAULT_CONFIG: RiskConfig = {
  level: DEFAULT_RISK_LEVEL,
  contingencyMargin: getRiskDefaultMargin(DEFAULT_RISK_LEVEL),
}

const storageKey = (projectId: string) => `risk_config_${projectId}`

export const riskService = {
  getDefaultMargin: (level: RiskLevel): number => {
    return getRiskDefaultMargin(level)
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
      const level: RiskLevel = isRiskLevel(parsed.level)
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
