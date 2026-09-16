import { SprintCalculationResult } from "../types"

const SPRINT_CONFIG_KEY = "sprint-config"
const STORY_POINTS_KEY = "story-points-assignments"
const USER_STORIES_KEY = "intecx_user_stories"

interface StoryItemWithPoints {
  storyPoints?: number
}

interface SprintConfigData {
  velocity?: number
  sprintDuration?: number
  sprintUnit?: "semanas" | "dias"
}

export const calculateSprintsAndProjectTime =
  async (): Promise<SprintCalculationResult> => {
    if (typeof window === "undefined") {
      return {
        totalStoryPoints: 40,
        velocity: 20,
        sprintDuration: 2,
        sprintUnit: "semanas",
        totalSprints: 2,
        totalBaseTime: 4,
      }
    }

    let velocity = 20
    let sprintDuration = 2
    let sprintUnit: "semanas" | "dias" = "semanas"

    const savedConfig = localStorage.getItem(SPRINT_CONFIG_KEY)
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as SprintConfigData
        if (config.velocity) velocity = Number(config.velocity)
        if (config.sprintDuration)
          sprintDuration = Number(config.sprintDuration)
        if (config.sprintUnit) sprintUnit = config.sprintUnit
      } catch {
        // fallback
      }
    }

    let totalStoryPoints = 0
    const savedSP = localStorage.getItem(STORY_POINTS_KEY)
    const savedStories = localStorage.getItem(USER_STORIES_KEY)

    if (savedSP) {
      try {
        const parsed = JSON.parse(savedSP) as unknown
        if (Array.isArray(parsed)) {
          totalStoryPoints = (parsed as StoryItemWithPoints[]).reduce(
            (sum, item) => sum + (Number(item.storyPoints) || 0),
            0
          )
        } else if (typeof parsed === "object" && parsed !== null) {
          totalStoryPoints = Object.values(
            parsed as Record<string, number>
          ).reduce((sum, val) => sum + (Number(val) || 0), 0)
        }
      } catch {
        // fallback
      }
    } else if (savedStories) {
      try {
        const stories = JSON.parse(savedStories) as StoryItemWithPoints[]
        if (Array.isArray(stories)) {
          totalStoryPoints = stories.reduce(
            (sum, s) => sum + (Number(s.storyPoints) || 0),
            0
          )
        }
      } catch {
        // fallback
      }
    }

    if (totalStoryPoints === 0) totalStoryPoints = 40

    const validVelocity = Math.max(velocity, 1)
    const validDuration = Math.max(sprintDuration, 1)
    const totalSprints = Math.ceil(totalStoryPoints / validVelocity)
    const totalBaseTime = totalSprints * validDuration

    return {
      totalStoryPoints,
      velocity,
      sprintDuration,
      sprintUnit,
      totalSprints,
      totalBaseTime,
    }
  }
