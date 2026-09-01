import { z } from "zod"

export const ALL_ROLES_VALUE = "all"

export const userFiltersSchema = z.object({
  firstName: z.string(),
  email: z.string(),
  role: z.string(),
})
