import type { ProfileCostBreakdown } from "./profile-cost-breakdown"
import type { TaskCost } from "./task-cost"

export type ProjectCostSummary = {
  taskCosts: readonly TaskCost[]
  profileBreakdown: readonly ProfileCostBreakdown[]
  totalCost: number
}
