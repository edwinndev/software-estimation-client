import { SprintCalculationResult } from "../types"
import {
  getStoryPointsAssignments,
  getUserStories,
} from "./user-stories.service"

const SPRINT_CONFIG_KEY = "sprint-config"

interface SprintConfigData {
  velocity?: number
  sprintDuration?: number
  duration?: number
  sprintUnit?: "semanas" | "dias"
  unit?: "semanas" | "dias"
}

export const calculateSprintsAndProjectTime = async (
  projectId: string = "1"
): Promise<SprintCalculationResult> => {
  if (typeof window === "undefined") {
    return {
      totalStoryPoints: 0,
      velocity: 5,
      sprintDuration: 2,
      sprintUnit: "dias",
      totalSprints: 0,
      totalBaseTime: 0,
    }
  }

  // 1. Obtener configuración de Sprint guardada
  let velocity = 5
  let sprintDuration = 2
  let sprintUnit: "semanas" | "dias" = "dias"

  const savedConfig =
    localStorage.getItem(`${SPRINT_CONFIG_KEY}:${projectId}`) ||
    localStorage.getItem(SPRINT_CONFIG_KEY)

  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig) as SprintConfigData
      if (config.velocity !== undefined && Number(config.velocity) > 0) {
        velocity = Number(config.velocity)
      }
      if (config.duration !== undefined && Number(config.duration) > 0) {
        sprintDuration = Number(config.duration)
      } else if (
        config.sprintDuration !== undefined &&
        Number(config.sprintDuration) > 0
      ) {
        sprintDuration = Number(config.sprintDuration)
      }
      if (config.unit) {
        sprintUnit = config.unit
      } else if (config.sprintUnit) {
        sprintUnit = config.sprintUnit
      }
    } catch {
      // fallback
    }
  }

  // 2. Obtener las historias reales de la tabla y sus puntos asignados
  const stories = await getUserStories(projectId)
  const assignments = await getStoryPointsAssignments()

  let totalStoryPoints = 0

  if (stories && stories.length > 0) {
    // Suma exacta de cada historia visible en la tabla
    totalStoryPoints = stories.reduce((sum, story) => {
      const assigned = assignments[story.id] ?? story.storyPoints ?? 0
      return sum + Number(assigned)
    }, 0)
  } else {
    // Si no hay backlog aún, sumar las asignaciones directas
    totalStoryPoints = Object.values(assignments).reduce(
      (sum, pts) => sum + Number(pts || 0),
      0
    )
  }

  // 3. Fórmulas de cálculo
  const validVelocity = Math.max(velocity, 1)
  const validDuration = Math.max(sprintDuration, 1)
  const totalSprints =
    totalStoryPoints > 0 ? Math.ceil(totalStoryPoints / validVelocity) : 0
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
