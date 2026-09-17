import { z } from "zod"

export const sprintConfigSchema = z.object({
  velocity: z.coerce.number().int().min(1),
  duration: z.coerce.number().int().min(1),
  unit: z.enum(["dias", "semanas"]),
})
