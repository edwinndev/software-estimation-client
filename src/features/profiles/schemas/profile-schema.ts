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
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  role: z.enum(technicalRoles, {
    message: "Please select a valid technical role.",
  }),
  hourlyRate: z
    .number({ message: "CER hourly rate must be a valid number." })
    .positive({ message: "CER hourly rate must be greater than 0." }),
  currency: z.string().min(1, { message: "Please specify a currency." }),
  experienceLevel: z.enum(experienceLevels, {
    message: "Please select a valid experience level.",
  }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  isActive: z.boolean(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
