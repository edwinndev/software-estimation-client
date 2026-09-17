import type { CostAssignment } from "../types/cost-assignment"
import { roundMoney } from "@/lib/format"

export const calculateTaskCost = (
  assignments: readonly CostAssignment[]
): number =>
  roundMoney(
    assignments.reduce((total, assignment) => {
      const estimatedHours = Number(assignment.estimatedHours)
      const cer = Number(assignment.cer)

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

      const assignmentCost = roundMoney(estimatedHours * cer)
      const nextTotal = total + assignmentCost

      if (!Number.isFinite(nextTotal)) {
        throw new RangeError("Task cost overflowed")
      }

      return nextTotal
    }, 0)
  )
