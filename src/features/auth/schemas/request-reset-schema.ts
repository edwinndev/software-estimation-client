import { z } from "zod"

export const requestResetSchema = z.object({
  email: z.email("Ingresa un correo electrónico válido"),
})
