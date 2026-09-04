import { z } from "zod"

export const verifyResetSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Ingresa el código de 6 dígitos"),
})
