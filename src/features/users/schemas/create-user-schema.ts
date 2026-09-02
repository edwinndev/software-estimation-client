import { z } from "zod"
import { userIdentitySchema, userPasswordSchema } from "./user-fields"

export const createUserSchema = userIdentitySchema
  .extend({
    password: userPasswordSchema,
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
