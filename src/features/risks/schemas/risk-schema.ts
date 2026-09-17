import { z } from "zod"

export const riskConfigSchema = z.object({
  level: z.enum(["low", "medium", "high"]),
  contingencyMargin: z.number().min(0).max(100),
})

export type RiskConfigSchema = z.infer<typeof riskConfigSchema>
