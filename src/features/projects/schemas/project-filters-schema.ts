import { z } from "zod"

export const ALL_PROJECT_FILTER_VALUE = "all"

export const projectFiltersSchema = z.object({
  nombre: z.string(),
  tipo: z.string(),
  responsable: z.string(),
  estado: z.string(),
})
