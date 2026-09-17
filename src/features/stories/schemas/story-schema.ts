import { z } from "zod"

export const storySchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["draft", "ready", "in-progress", "done"]),
})

export const taskSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  estimate: z.number().int().min(1, "La estimación mínima es 1 hora"),
  status: z.enum(["todo", "in-progress", "done"]),
  profileIds: z
    .array(z.string())
    .min(1, "Selecciona al menos un perfil técnico"),
})

export type StoryFormValues = z.infer<typeof storySchema>
export type TaskFormValues = z.infer<typeof taskSchema>
