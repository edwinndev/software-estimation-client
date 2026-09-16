import { TaskHourEntry, TechnicalProfile } from "../types"

// Claves de LocalStorage
const TASK_HOURS_STORAGE_KEY = "task-hours-entries"
const PROFILES_STORAGE_KEY = "intecx_profiles"

// Perfiles por defecto si el módulo de perfiles aún no los guardó
const FALLBACK_PROFILES: TechnicalProfile[] = [
  { id: "prof-backend", name: "Backend Developer", cerPerHour: 50 },
  { id: "prof-frontend", name: "Frontend Developer", cerPerHour: 40 },
  { id: "prof-qa", name: "QA / Testing Engineer", cerPerHour: 30 },
  { id: "prof-ux", name: "Diseñador UX/UI", cerPerHour: 35 },
  { id: "prof-devops", name: "DevOps Engineer", cerPerHour: 55 },
]

/**
 * 1. Lee los perfiles técnicos de localStorage (con fallback temporal)
 */
export const getTechnicalProfiles = async (): Promise<TechnicalProfile[]> => {
  if (typeof window === "undefined") return FALLBACK_PROFILES
  const data = localStorage.getItem(PROFILES_STORAGE_KEY)
  return data ? JSON.parse(data) : FALLBACK_PROFILES
}

/**
 * 2. Lee todas las horas de tareas guardadas ("task-hours-entries")
 */
export const getTaskHoursEntries = async (): Promise<TaskHourEntry[]> => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(TASK_HOURS_STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * 3. PMGT-32: Guarda una nueva estimación de horas para una tarea
 */
export const saveTaskHourEntry = async (
  entry: Omit<TaskHourEntry, "id" | "updatedAt">
): Promise<TaskHourEntry[]> => {
  const currentEntries = await getTaskHoursEntries()

  const newEntry: TaskHourEntry = {
    ...entry,
    id: `task-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  }

  const updatedEntries = [...currentEntries, newEntry]

  if (typeof window !== "undefined") {
    localStorage.setItem(TASK_HOURS_STORAGE_KEY, JSON.stringify(updatedEntries))
  }

  return updatedEntries
}
