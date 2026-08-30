export const STORAGE_KEYS = {
  USERS: "software-estimation:users",
  SESSION: "software-estimation:session",
  PASSWORD_RESET: "software-estimation:password-reset",
} as const

export const readJson = <T>(key: string): T | null => {
  if (typeof window === "undefined") {
    return null
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    window.localStorage.removeItem(key)
    return null
  }
}

export const writeJson = <T>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeJson = (key: string) => {
  window.localStorage.removeItem(key)
}
