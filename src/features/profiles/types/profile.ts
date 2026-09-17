import type { ExperienceLevelValue, TechnicalRoleValue } from "./role"

export type Profile = {
  id: string
  name: string
  role: TechnicalRoleValue
  hourlyRate: number
  currency: string
  experienceLevel: ExperienceLevelValue
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateProfilePayload = {
  name: string
  role: TechnicalRoleValue
  hourlyRate: number
  currency: string
  experienceLevel: ExperienceLevelValue
  email: string
  isActive: boolean
}

export type UpdateProfilePayload = Partial<CreateProfilePayload> & {
  id: string
}
