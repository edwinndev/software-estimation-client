import type { RiskLevel } from "@/enumeration/risk-level"

export type { RiskLevel }

export type RiskConfig = {
  level: RiskLevel
  contingencyMargin: number
}

export type EstimationImpact = {
  originalTime: number
  originalCost: number
  contingencyTime: number
  contingencyCost: number
  totalTime: number
  totalCost: number
}
