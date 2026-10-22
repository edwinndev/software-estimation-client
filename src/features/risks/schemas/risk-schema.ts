import { z } from "zod"
import { RISK_LEVELS } from "@/enumeration/risk-level"

export const riskConfigSchema = z.object({
  level: z.enum(RISK_LEVELS),
  contingencyMargin: z.number().min(0).max(100),
})

export type RiskConfigSchema = z.infer<typeof riskConfigSchema>
