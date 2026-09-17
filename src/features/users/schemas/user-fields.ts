import { z } from "zod"
import { USER_ROLES } from "@/features/auth/types"

export const userNameSchema = z
  .string()
  .trim()
  .min(2, "Debe tener al menos 2 caracteres")

export const userPasswordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra")
  .regex(/\d/, "La contraseña debe incluir al menos un número")

export const userIdentitySchema = z.object({
  firstName: userNameSchema,
  lastName: userNameSchema,
  email: z.email("Ingresa un correo electrónico válido"),
  role: z.enum(USER_ROLES),
})
