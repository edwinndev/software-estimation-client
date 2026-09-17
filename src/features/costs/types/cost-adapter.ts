import type { ProfileCostAssignment } from "./profile-cost-breakdown"

export type ExternalHourAssignment = {
  projectId: string
  taskId: string
  taskName: string
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
  hours: number
}

export type CostTechnicalProfile = {
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
  cer: number
}

export type NormalizedCostAssignment = ProfileCostAssignment & {
  taskId: string
  taskName: string
}
