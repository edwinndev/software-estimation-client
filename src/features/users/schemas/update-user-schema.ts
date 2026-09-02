import { z } from "zod"
import { userIdentitySchema, userPasswordSchema } from "./user-fields"

export const updateUserSchema = userIdentitySchema
  .extend({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((value, context) => {
    if (value.password.length === 0 && value.confirmPassword.length === 0) {
      return
    }

    const passwordResult = userPasswordSchema.safeParse(value.password)
    if (!passwordResult.success) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message:
          passwordResult.error.issues[0]?.message ??
          "La contraseña no cumple las reglas mínimas",
      })
    }

    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
      })
    }
  })
