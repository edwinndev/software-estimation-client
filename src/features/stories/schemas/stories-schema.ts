import { z } from "zod"

export const storySchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["draft", "ready", "in-progress", "done"]),
})

export const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  estimate: z.number().min(1, "La estimación debe ser mayor a cero"),
  status: z.enum(["todo", "in-progress", "done"]),
  profileIds: z.array(z.string()).min(1, "Asigna al menos un perfil técnico"),
})

export type StoryFormValues = z.infer<typeof storySchema>
export type TaskFormValues = z.infer<typeof taskSchema>
