import type { CostAssignment } from "../types/cost-assignment"

export const calculateTaskCost = (
  assignments: readonly CostAssignment[]
): number =>
  assignments.reduce((total, { estimatedHours, cer }) => {
    if (
      !Number.isFinite(estimatedHours) ||
      estimatedHours < 0 ||
      !Number.isFinite(cer) ||
      cer < 0
    ) {
      throw new RangeError(
        "Cost assignment values must be finite and non-negative"
      )
    }

    return total + estimatedHours * cer
  }, 0)
