import { z } from "zod"
import { userIdentitySchema } from "./user-fields"

export const updateUserSchema = userIdentitySchema.extend({
  isActive: z.boolean(),
})
