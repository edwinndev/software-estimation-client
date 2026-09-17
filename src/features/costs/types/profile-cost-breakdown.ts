import type { CostAssignment } from "./cost-assignment"

export type ProfileCostAssignment = CostAssignment & {
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
}

export type ProfileCostBreakdown = {
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
  totalHours: number
  cer: number
  totalCost: number
}
