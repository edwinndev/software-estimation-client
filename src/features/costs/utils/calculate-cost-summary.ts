import type { NormalizedCostAssignment } from "../types/cost-adapter"
import type { ProjectCostSummary } from "../types/project-cost-summary"
import type { TaskCost } from "../types/task-cost"
import { calculateProjectCostSummary } from "./calculate-project-cost-summary"
import { calculateTaskCost } from "./calculate-task-cost"
import { groupCostsByProfile } from "./group-costs-by-profile"

type TaskAccumulator = {
  taskId: string
  taskName: string
  assignments: NormalizedCostAssignment[]
}

export const calculateCostSummary = (
  assignments: readonly NormalizedCostAssignment[]
): ProjectCostSummary => {
  const tasks = new Map<string, TaskAccumulator>()

  assignments.forEach((assignment) => {
    const task = tasks.get(assignment.taskId)

    if (task && task.taskName !== assignment.taskName) {
      throw new Error("Assignments for the same task must use one task name")
    }

    if (task) {
      task.assignments.push(assignment)
      return
    }

    tasks.set(assignment.taskId, {
      taskId: assignment.taskId,
      taskName: assignment.taskName,
      assignments: [assignment],
    })
  })

  const taskCosts: TaskCost[] = Array.from(tasks.values(), (task) => ({
    taskId: task.taskId,
    taskName: task.taskName,
    totalCost: calculateTaskCost(task.assignments),
  }))
  const profileBreakdown = groupCostsByProfile(assignments)

  return calculateProjectCostSummary(taskCosts, profileBreakdown)
}
