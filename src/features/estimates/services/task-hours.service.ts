import { TaskHourEntry, TechnicalProfile } from "../types"

const TASK_HOURS_STORAGE_KEY = "task-hours-entries"
const PROFILES_STORAGE_KEY = "intecx_profiles"

// Lista base de roles (por si la BD está vacía al iniciar)
const FALLBACK_PROFILES: TechnicalProfile[] = [
  { id: "Frontend", name: "Frontend" },
  { id: "Backend", name: "Backend" },
  { id: "Fullstack", name: "Fullstack" },
  { id: "QA", name: "QA" },
  { id: "DevOps", name: "DevOps" },
  { id: "UI/UX Designer", name: "UI/UX Designer" },
  { id: "Product Manager", name: "Product Manager" },
  { id: "Tech Lead", name: "Tech Lead" },
  { id: "Functional Analyst", name: "Functional Analyst" },
]

/**
 * PMGT-32: Solo jalar/leer los perfiles técnicos de LocalStorage
 */
export const getTechnicalProfiles = async (): Promise<TechnicalProfile[]> => {
  if (typeof window === "undefined") return FALLBACK_PROFILES

  const saved = localStorage.getItem(PROFILES_STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as TechnicalProfile[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch {
      // fallback
    }
  }

  return FALLBACK_PROFILES
}

/**
 * Leer las horas de esfuerzo registradas
 */
export const getTaskHoursEntries = async (): Promise<TaskHourEntry[]> => {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(TASK_HOURS_STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data) as TaskHourEntry[]
    } catch {
      // fallback
    }
  }

  return []
}

/**
 * Guardar la estimación de horas asociada al perfil
 */
export const saveTaskHourEntry = async (
  entry: Omit<TaskHourEntry, "id" | "updatedAt">
): Promise<TaskHourEntry> => {
  const newEntry: TaskHourEntry = {
    ...entry,
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    const existing = await getTaskHoursEntries()
    const updated = [...existing, newEntry]
    localStorage.setItem(TASK_HOURS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event("task-hours-updated"))
  }

  return newEntry
}
