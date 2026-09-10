import { z } from 'zod';

export const riskLevelSchema = z.enum(['low', 'medium', 'high']);

export const riskConfigSchema = z.object({
  levels: z.object({
    low: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    high: z.number().min(0).max(100),
  }),
});

export type RiskConfigInput = z.infer<typeof riskConfigSchema>;