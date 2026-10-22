import { z } from "zod"
import { userIdentitySchema } from "./user-fields"

export const createUserSchema = userIdentitySchema.extend({
  isActive: z.boolean(),
})
