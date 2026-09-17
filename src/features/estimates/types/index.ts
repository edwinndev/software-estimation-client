export const STORY_POINTS_OPTIONS = [1, 2, 3, 5, 8, 13, 20] as const

export type StoryPoints = (typeof STORY_POINTS_OPTIONS)[number]

export type SprintConfig = {
  velocity: number
  duration: number
  unit: "dias" | "semanas"
}

export type TaskHourEntry = {
  id: string
  projectId: string
  storyId: string
  storyCode: string
  storyTitle: string
  taskId: string
  taskTitle: string
  profileId: string
  profileName: string
  estimatedHours: number
  isAutomatic: boolean
  adjustmentReason: string
  updatedAt: string
}

export type UpdateTaskHoursInput = {
  taskId: string
  profileId: string
  hours: number
  adjustmentReason: string
}

export type SprintCalculationResult = {
  totalStoryPoints: number
  storiesTotal: number
  storiesWithPoints: number
  velocity: number
  sprintDuration: number
  sprintUnit: "dias" | "semanas"
  totalSprints: number
  totalBaseTime: number
  totalEffortHours: number
  tasksTotal: number
  tasksWithHours: number
}
