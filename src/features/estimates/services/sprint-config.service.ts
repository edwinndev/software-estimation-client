import type { SprintConfig } from "../types"

/**
 * PMGT-33 + PMGT-35: Configuración del Equipo y Sprint.
 */
const STORAGE_KEY = "sprint-config"
const SIMULATED_DELAY_MS = 200

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const isBrowser = () => typeof window !== "undefined"

const DEFAULT_CONFIG: SprintConfig = {
  velocity: 5,
  duration: 2,
  unit: "dias",
}

export const sprintConfigService = {
  async get(projectId?: string): Promise<SprintConfig> {
    await delay(SIMULATED_DELAY_MS)
    if (!isBrowser()) return DEFAULT_CONFIG

    const key = projectId ? `${STORAGE_KEY}:${projectId}` : STORAGE_KEY
    const raw =
      window.localStorage.getItem(key) ||
      window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG

    try {
      const parsed = JSON.parse(raw) as SprintConfig
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
      }
    } catch {
      return DEFAULT_CONFIG
    }
  },

  async save(config: SprintConfig, projectId?: string): Promise<SprintConfig> {
    await delay(SIMULATED_DELAY_MS)
    if (isBrowser()) {
      const json = JSON.stringify(config)
      if (projectId) {
        window.localStorage.setItem(`${STORAGE_KEY}:${projectId}`, json)
      }
      window.localStorage.setItem(STORAGE_KEY, json)
    }
    return config
  },
}
