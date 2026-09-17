import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import { storiesService } from "@/features/stories/services/stories-service"
import { STORY_POINTS_OPTIONS, type StoryPoints } from "../types"

const getAssignmentsKey = (projectId: string) =>
  `software-estimation:story-points:${projectId}`

export type UserStoryItem = {
  id: string
  code: string
  title: string
  storyPoints: StoryPoints | 0
}

const isStoryPoints = (value: number): value is StoryPoints =>
  STORY_POINTS_OPTIONS.includes(value as StoryPoints)

export const getStoryPointsAssignments = async (
  projectId: string
): Promise<Record<string, StoryPoints>> => {
  if (typeof window === "undefined") return {}

  const storedPoints = localStorage.getItem(getAssignmentsKey(projectId))
  if (!storedPoints) return {}

  try {
    const parsed = JSON.parse(storedPoints) as Record<string, number>
    const assignments: Record<string, StoryPoints> = {}

    Object.entries(parsed).forEach(([storyId, value]) => {
      const points = Number(value)
      if (isStoryPoints(points)) {
        assignments[storyId] = points
      }
    })

    return assignments
  } catch {
    return {}
  }
}

export const getUserStories = async (
  projectId: string
): Promise<UserStoryItem[]> => {
  const backlog = await storiesService.getStories(projectId)
  const assignments = await getStoryPointsAssignments(projectId)

  return backlog.stories.map((story) => ({
    id: story.id,
    code: story.code,
    title: story.title,
    storyPoints: assignments[story.id] ?? 0,
  }))
}

export const assignStoryPoints = async (
  projectId: string,
  storyId: string,
  storyPoints: StoryPoints
): Promise<void> => {
  await requireProjectAction(projectId, "editEstimation")
  if (typeof window === "undefined") return

  const currentPoints = await getStoryPointsAssignments(projectId)
  currentPoints[storyId] = storyPoints
  localStorage.setItem(
    getAssignmentsKey(projectId),
    JSON.stringify(currentPoints)
  )
}

export const userStoriesService = {
  getUserStories,
  getAssignments: getStoryPointsAssignments,
  assignStoryPoints,
  isStoryPoints,
}
