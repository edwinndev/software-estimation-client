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
// 1. Perfil técnico maestro
export interface TechnicalProfile {
  id: string
  name: string
  cerPerHour?: number
}

// 2. Entrada de horas por tarea (PMGT-32 y PMGT-31)
export interface TaskHourEntry {
  id: string
  userStoryId: string
  userStoryCode?: string // ej. "HU-01"
  taskTitle: string
  profileId: string
  profileName: string
  estimatedHours: number
  adjustmentReason?: string // Para el motivo de ajuste en PMGT-31
  updatedAt: string
}
// PMGT-34: Resultado del cálculo de Sprints y Tiempo
export interface SprintCalculationResult {
  totalStoryPoints: number
  velocity: number
  sprintDuration: number
  sprintUnit: "semanas" | "dias"
  totalSprints: number
  totalBaseTime: number
}
export interface TechnicalProfile {
  id: string
  name: string
  cerPerHour?: number
}
