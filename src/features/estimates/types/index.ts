/**
 * PMGT-36: Story Points por historia de usuario.
 * Combo fijo definido en la Especificación de Flujo (Paso 2).
 */
export const STORY_POINTS_OPTIONS = [1, 2, 3, 5, 8, 13, 20, 40] as const

export type StoryPoints = (typeof STORY_POINTS_OPTIONS)[number]
export interface SprintConfig {
  velocity: number
  duration: number
  unit: "dias" | "semanas"
}

export interface TechnicalProfile {
  id: string
  name: string
  cerPerHour: number
}

export interface TaskHourEntry {
  id: string
  taskId: string
  taskTitle: string
  profileId: string
  profileName: string
  hours: number
  adjustmentReason?: string
  updatedAt: string
}

export interface SprintCalculationResult {
  totalStoryPoints: number
  velocity: number
  sprintDuration: number
  sprintUnit: "semanas" | "dias"
  totalSprints: number
  totalBaseTime: number
}

/**
 * PMGT-36: tipo MÍNIMO de una historia de usuario.
 
 * los campos que realmente necesitamos (id + title), no toda su estructura.
 */
export interface BorrowedUserStory {
  id: string
  title: string
}

/** Mapa de historiaId -> Story Points asignados.  */
export type StoryPointsAssignments = Record<string, number>
