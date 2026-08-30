import { z } from "zod"

export const projectSchema = z
  .object({
    nombre: z.string().min(1, "Este campo es obligatorio"),
    descripcion: z.string().max(500, "Máx. 500 caracteres"),
    tipo: z.string().min(1, "Selecciona el tipo de proyecto"),
    fecha_inicio: z.date().optional(),
    fecha_fin: z.date().optional(),
    responsable: z.string().min(1, "Selecciona un responsable"),
  })
  .superRefine((data, ctx) => {
    if (!data.fecha_inicio) {
      ctx.addIssue({
        code: "custom",
        message: "Selecciona una fecha",
        path: ["fecha_inicio"],
      })
    }
    if (!data.fecha_fin) {
      ctx.addIssue({
        code: "custom",
        message: "Selecciona una fecha",
        path: ["fecha_fin"],
      })
    } else if (data.fecha_inicio && data.fecha_fin < data.fecha_inicio) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de entrega no puede ser anterior a la de inicio",
        path: ["fecha_fin"],
      })
    }
  })

export type ProjectFormValues = z.infer<typeof projectSchema>
