import type { BorrowedUserStory, StoryPointsAssignments } from "../types"

/**
 * PMGT-36: Asignar Story Points a historias de usuario.
 *
 * IMPORTANTE — dos claves distintas, con dueños distintos:
 * - "user-stories": la crea y mantiene el módulo de Historias de Usuario
 *   (PMGT-18, Cristina). Nosotros SOLO LEEMOS esta clave, nunca escribimos
 *   en ella. Mientras ese módulo no exista, sembramos datos de ejemplo bajo
 *   el mismo nombre para no bloquearnos.
 * - "story-points-assignments": esta SÍ es nuestra. Es un mapa
 *   { historiaId: storyPoints } que solo este módulo lee y escribe.
 */
const USER_STORIES_KEY = "user-stories"
const ASSIGNMENTS_KEY = "story-points-assignments"
const SIMULATED_DELAY_MS = 200

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const isBrowser = () => typeof window !== "undefined"

const SEED_USER_STORIES: BorrowedUserStory[] = [
  { id: "1", title: "Como usuario quiero iniciar sesión con mi correo" },
  { id: "2", title: "Como usuario quiero ver el listado de mis proyectos" },
  { id: "3", title: "Como administrador quiero configurar perfiles técnicos" },
]

const seedUserStoriesIfEmpty = () => {
  if (!isBrowser()) return
  const raw = window.localStorage.getItem(USER_STORIES_KEY)
  if (raw) return
  window.localStorage.setItem(
    USER_STORIES_KEY,
    JSON.stringify(SEED_USER_STORIES)
  )
}

export const userStoriesService = {
  /** Lee las historias de usuario (dato ajeno, solo lectura). */
  async listUserStories(): Promise<BorrowedUserStory[]> {
    await delay(SIMULATED_DELAY_MS)
    if (!isBrowser()) return SEED_USER_STORIES

    seedUserStoriesIfEmpty()
    const raw = window.localStorage.getItem(USER_STORIES_KEY)
    if (!raw) return SEED_USER_STORIES

    try {
      return JSON.parse(raw) as BorrowedUserStory[]
    } catch {
      return SEED_USER_STORIES
    }
  },

  /** Lee el mapa de asignaciones de puntos (dato propio). */
  async getAssignments(): Promise<StoryPointsAssignments> {
    await delay(SIMULATED_DELAY_MS)
    if (!isBrowser()) return {}

    const raw = window.localStorage.getItem(ASSIGNMENTS_KEY)
    if (!raw) return {}

    try {
      return JSON.parse(raw) as StoryPointsAssignments
    } catch {
      return {}
    }
  },

  /** Asigna/actualiza los Story Points de una historia (dato propio). */
  async assignStoryPoints(
    storyId: string,
    points: number
  ): Promise<StoryPointsAssignments> {
    await delay(SIMULATED_DELAY_MS)
    if (!isBrowser()) return {}

    const raw = window.localStorage.getItem(ASSIGNMENTS_KEY)
    const current: StoryPointsAssignments = raw ? JSON.parse(raw) : {}
    const updated = { ...current, [storyId]: points }

    window.localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(updated))
    return updated
  },
}
