import { z } from "zod"
import { refineDateRange } from "@/lib/date-range"

export const ALL_PROJECT_FILTER_VALUE = "all"

export const projectFiltersSchema = z
  .object({
    nombre: z.string(),
    tipo: z.string(),
    responsable: z.string(),
    estado: z.string(),
    fecha_inicio: z.date().or(z.undefined()),
    fecha_fin: z.date().or(z.undefined()),
  })
  .superRefine((data, ctx) => {
    refineDateRange(
      ctx,
      data.fecha_inicio,
      data.fecha_fin,
      {
        start: ["fecha_inicio"],
        end: ["fecha_fin"],
      },
      { required: false }
    )
  })
