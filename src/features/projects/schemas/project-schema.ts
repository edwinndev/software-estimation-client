import { z } from "zod"
import { refineDateRange } from "@/lib/date-range"

export const projectSchema = z
  .object({
    nombre: z.string().min(1, "Este campo es obligatorio"),
    descripcion: z
      .string()
      .trim()
      .max(500, "Máx. 500 caracteres")
      .refine((value) => value.length === 0 || value.length >= 10, {
        message: "La descripción debe tener al menos 10 caracteres",
      }),
    tipo: z.string().min(1, "Selecciona el tipo de proyecto"),
    fecha_inicio: z.date().or(z.undefined()),
    fecha_fin: z.date().or(z.undefined()),
    responsable: z.string().min(1, "Selecciona un responsable"),
    estado: z.string().min(1, "Selecciona el estado"),
  })
  .superRefine((data, ctx) => {
    refineDateRange(ctx, data.fecha_inicio, data.fecha_fin, {
      start: ["fecha_inicio"],
      end: ["fecha_fin"],
    })
  })

export type ProjectFormValues = z.infer<typeof projectSchema>
export type ProjectEditFormValues = ProjectFormValues
