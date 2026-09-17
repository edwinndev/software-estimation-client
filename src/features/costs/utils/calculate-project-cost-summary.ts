import type { ProfileCostBreakdown } from "../types/profile-cost-breakdown"
import type { ProjectCostSummary } from "../types/project-cost-summary"
import type { TaskCost } from "../types/task-cost"
import { calculateProjectCost } from "./calculate-project-cost"

const calculateProfileBreakdownTotal = (
  profileBreakdown: readonly ProfileCostBreakdown[]
): number =>
  profileBreakdown.reduce((total, profile) => {
    if (!Number.isFinite(profile.totalCost) || profile.totalCost < 0) {
      throw new RangeError("Profile costs must be finite and non-negative")
    }

    const nextTotal = total + profile.totalCost

    if (!Number.isFinite(nextTotal)) {
      throw new RangeError("Profile breakdown cost overflowed")
    }

    return nextTotal
  }, 0)

export const calculateProjectCostSummary = (
  taskCosts: readonly TaskCost[],
  profileBreakdown: readonly ProfileCostBreakdown[]
): ProjectCostSummary => {
  const totalCost = calculateProjectCost(taskCosts)
  const profileTotalCost = calculateProfileBreakdownTotal(profileBreakdown)

  // Monetary rounding policy is pending; totals intentionally use exact equality.
  if (totalCost !== profileTotalCost) {
    throw new Error("Task and profile cost totals must match")
  }

  return {
    taskCosts,
    profileBreakdown,
    totalCost,
  }
}
