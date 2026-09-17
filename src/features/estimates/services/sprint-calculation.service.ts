import type { SprintCalculationResult } from "../types"
import { sprintConfigService } from "./sprint-config.service"
import { getTaskHourEntries } from "./task-hours.service"
import { getUserStories } from "./user-stories.service"

const EMPTY_CALCULATION: SprintCalculationResult = {
  totalStoryPoints: 0,
  storiesTotal: 0,
  storiesWithPoints: 0,
  velocity: 5,
  sprintDuration: 2,
  sprintUnit: "dias",
  totalSprints: 0,
  totalBaseTime: 0,
  totalEffortHours: 0,
  tasksTotal: 0,
  tasksWithHours: 0,
}

export const calculateSprintsAndProjectTime = async (
  projectId: string
): Promise<SprintCalculationResult> => {
  if (typeof window === "undefined") {
    return EMPTY_CALCULATION
  }

  const config = await sprintConfigService.get(projectId)
  const stories = await getUserStories(projectId)
  const hourEntries = await getTaskHourEntries(projectId)
  const totalStoryPoints = stories.reduce(
    (sum, story) => sum + Number(story.storyPoints),
    0
  )
  const storiesWithPoints = stories.filter(
    (story) => story.storyPoints > 0
  ).length
  const velocity = Math.max(config.velocity, 1)
  const sprintDuration = Math.max(config.duration, 1)
  const totalSprints =
    totalStoryPoints > 0 ? Math.ceil(totalStoryPoints / velocity) : 0
  const taskIds = new Set(hourEntries.map((entry) => entry.taskId))
  const tasksWithHours = new Set(
    hourEntries
      .filter((entry) => entry.estimatedHours > 0)
      .map((entry) => entry.taskId)
  ).size
  const totalEffortHours = hourEntries.reduce(
    (sum, entry) => sum + entry.estimatedHours,
    0
  )

  return {
    totalStoryPoints,
    storiesTotal: stories.length,
    storiesWithPoints,
    velocity,
    sprintDuration,
    sprintUnit: config.unit,
    totalSprints,
    totalBaseTime: totalSprints * sprintDuration,
    totalEffortHours: Number(totalEffortHours.toFixed(2)),
    tasksTotal: taskIds.size,
    tasksWithHours,
  }
}
