import { z } from "zod"

export const userNameSchema = z
  .string()
  .trim()
  .min(2, "Debe tener al menos 2 caracteres")

export const userIdentitySchema = z.object({
  firstName: userNameSchema,
  lastName: userNameSchema,
  email: z.email("Ingresa un correo electrónico válido").trim().toLowerCase(),
  roleId: z.string().uuid("Selecciona un rol válido"),
})
