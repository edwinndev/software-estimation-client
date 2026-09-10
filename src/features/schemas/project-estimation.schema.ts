import { z } from 'zod';
import { riskLevelSchema } from './risk-config.schema';

export const projectEstimationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  baseEstimatedHours: z.number().positive(),
  baseEstimatedCost: z.number().nonnegative(),
  riskLevel: riskLevelSchema,
  contingencyPercentageOverride: z
    .number()
    .min(0)
    .max(100)
    .nullish(), // 👈 nullish = nullable + optional
});

export const updateProjectRiskSchema = z.object({
  projectId: z.string().min(1),
  riskLevel: riskLevelSchema,
  contingencyPercentageOverride: z
    .number()
    .min(0)
    .max(100)
    .nullish(),
});

// Tipos derivados — NO redefinir en types/
export type ProjectEstimationInput = z.infer<typeof projectEstimationSchema>;
export type UpdateProjectRiskInput = z.infer<typeof updateProjectRiskSchema>;