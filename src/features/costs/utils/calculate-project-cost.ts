import type { TaskCost } from "../types/task-cost"

export const calculateProjectCost = (tasks: readonly TaskCost[]): number =>
  tasks.reduce((total, task) => {
    if (!Number.isFinite(task.totalCost) || task.totalCost < 0) {
      throw new RangeError("Task costs must be finite and non-negative")
    }

    const nextTotal = total + task.totalCost

    if (!Number.isFinite(nextTotal)) {
      throw new RangeError("Project cost overflowed")
    }

    return nextTotal
  }, 0)
