import { StoryPoints } from "../types"

// 🔑 Clave del backlog de Cristina
const getBacklogKey = (projectId: string = "1") =>
  `software-estimation:backlog:${projectId}`
const STORY_POINTS_STORAGE_KEY = "story-points-assignments"

export interface UserStoryItem {
  id: string
  code?: string
  title: string
  storyPoints?: StoryPoints | null
}

/**
 * 1. Obtener historias reales del Backlog
 */
export const getUserStories = async (
  projectId: string = "1"
): Promise<UserStoryItem[]> => {
  if (typeof window === "undefined") return []

  const storedBacklog = localStorage.getItem(getBacklogKey(projectId))
  let rawStories: UserStoryItem[] = []

  if (storedBacklog) {
    try {
      const parsed = JSON.parse(storedBacklog) as {
        stories?: Array<{
          id: string
          code?: string
          title: string
          storyPoints?: number
        }>
      }
      if (parsed.stories && parsed.stories.length > 0) {
        rawStories = parsed.stories.map((s, idx) => ({
          id: s.id,
          code: s.code || `HU-${String(idx + 1).padStart(2, "0")}`,
          title: s.title,
          storyPoints: (s.storyPoints as StoryPoints) || null,
        }))
      }
    } catch {
      rawStories = []
    }
  }

  return rawStories
}

/**
 * 2. Obtener el mapa de Story Points asignados
 */
export const getStoryPointsAssignments = async (): Promise<
  Record<string, StoryPoints>
> => {
  if (typeof window === "undefined") return {}

  const storedPoints = localStorage.getItem(STORY_POINTS_STORAGE_KEY)
  if (storedPoints) {
    try {
      return JSON.parse(storedPoints) as Record<string, StoryPoints>
    } catch {
      return {}
    }
  }
  return {}
}

/**
 * 3. Guardar asignación de Story Points
 */
export const assignStoryPoints = async (
  storyId: string,
  storyPoints: StoryPoints
): Promise<void> => {
  if (typeof window === "undefined") return

  const currentPoints = await getStoryPointsAssignments()
  currentPoints[storyId] = storyPoints
  localStorage.setItem(STORY_POINTS_STORAGE_KEY, JSON.stringify(currentPoints))
  window.dispatchEvent(new Event("story-points-updated"))
}

// 📦 Exportar el objeto de servicio para el hook
export const userStoriesService = {
  getUserStories,
  getAssignments: getStoryPointsAssignments,
  assignStoryPoints,
}
