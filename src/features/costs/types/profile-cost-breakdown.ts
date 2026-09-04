import type { CostAssignment } from "./cost-assignment"

export type ProfileCostAssignment = CostAssignment & {
  profileId: string
  profileName: string
}

export type ProfileCostBreakdown = {
  profileId: string
  profileName: string
  totalHours: number
  cer: number
  totalCost: number
}
