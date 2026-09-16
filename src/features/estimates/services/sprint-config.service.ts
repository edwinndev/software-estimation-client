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
  velocity: 20,
  duration: 2,
  unit: "semanas",
}

export const sprintConfigService = {
  async get(): Promise<SprintConfig> {
    await delay(SIMULATED_DELAY_MS)
    if (!isBrowser()) return DEFAULT_CONFIG

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG

    try {
      return JSON.parse(raw) as SprintConfig
    } catch {
      return DEFAULT_CONFIG
    }
  },

  async save(config: SprintConfig): Promise<SprintConfig> {
    await delay(SIMULATED_DELAY_MS)
    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    }
    return config
  },
}
