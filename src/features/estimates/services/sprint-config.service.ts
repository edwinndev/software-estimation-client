import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import type { SprintConfig } from "../types"

const STORAGE_KEY = "software-estimation:sprint-config"
const SIMULATED_DELAY_MS = 200

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const isBrowser = () => typeof window !== "undefined"

const DEFAULT_CONFIG: SprintConfig = {
  velocity: 5,
  duration: 2,
  unit: "dias",
}

const storageKey = (projectId: string) => `${STORAGE_KEY}:${projectId}`

export const sprintConfigService = {
  async get(projectId: string): Promise<SprintConfig> {
    await delay(SIMULATED_DELAY_MS)
    if (!isBrowser()) return DEFAULT_CONFIG

    const raw = window.localStorage.getItem(storageKey(projectId))
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

  async save(projectId: string, config: SprintConfig): Promise<SprintConfig> {
    await requireProjectAction(projectId, "editEstimation")
    await delay(SIMULATED_DELAY_MS)
    if (isBrowser()) {
      window.localStorage.setItem(storageKey(projectId), JSON.stringify(config))
    }
    return config
  },
}
