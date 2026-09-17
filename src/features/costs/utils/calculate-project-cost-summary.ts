import type { ProfileCostBreakdown } from "../types/profile-cost-breakdown"
import type { ProjectCostSummary } from "../types/project-cost-summary"
import type { TaskCost } from "../types/task-cost"
import { roundMoney } from "@/lib/format"
import { calculateProjectCost } from "./calculate-project-cost"

export const calculateProjectCostSummary = (
  taskCosts: readonly TaskCost[],
  profileBreakdown: readonly ProfileCostBreakdown[]
): ProjectCostSummary => {
  return {
    taskCosts,
    profileBreakdown,
    totalCost: roundMoney(calculateProjectCost(taskCosts)),
  }
}
