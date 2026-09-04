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

    const assignmentCost = estimatedHours * cer

    if (!Number.isFinite(assignmentCost)) {
      throw new RangeError("Task assignment cost overflowed")
    }

    const nextTotal = total + assignmentCost

    if (!Number.isFinite(nextTotal)) {
      throw new RangeError("Task cost overflowed")
    }

    return nextTotal
  }, 0)
