import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Ingresa un correo electrónico válido").trim().toLowerCase(),
  password: z.string().min(1, "Ingresa tu contraseña"),
})
