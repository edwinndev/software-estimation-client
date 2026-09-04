import { z } from "zod"

export const technicalRoles = [
  "Frontend",
  "Backend",
  "Fullstack",
  "QA",
  "DevOps",
  "UI/UX Designer",
  "Product Manager",
  "Tech Lead",
  "Functional Analyst",
  "Other",
] as const

export const experienceLevels = ["Junior", "Mid", "Senior", "Lead"] as const

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { message: "El nombre no debe exceder los 100 caracteres." }),
  role: z.enum(technicalRoles, {
    message: "Por favor selecciona un rol técnico válido.",
  }),
  hourlyRate: z
    .number({ message: "El costo horario (CER) debe ser un número válido." })
    .positive({ message: "El costo horario (CER) debe ser mayor a 0." }),
  currency: z.string().min(1, { message: "Por favor especifica una moneda." }),
  experienceLevel: z.enum(experienceLevels, {
    message: "Por favor selecciona un nivel de experiencia válido.",
  }),
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo electrónico válido." }),
  isActive: z.boolean(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
