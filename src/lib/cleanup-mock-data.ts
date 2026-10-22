import { STORAGE_KEYS } from "./storage"

const SEED_CLEANED_FLAG = "software-estimation:seed-cleaned-v1"

export const purgeMockSeedData = () => {
  if (typeof window === "undefined") return

  try {
    const ls = window.localStorage
    if (ls.getItem(SEED_CLEANED_FLAG)) {
      return
    }

    // Remove legacy seed version key
    ls.removeItem("software-estimation:seed-version")

    // Filter out mock projects (p1 to p8)
    const storedProjects = ls.getItem(STORAGE_KEYS.PROJECTS)
    if (storedProjects) {
      try {
        const parsed = JSON.parse(storedProjects)
        if (Array.isArray(parsed)) {
          const nonSeedProjects = parsed.filter(
            (p: { id?: string }) => !p.id?.match(/^p[1-8]$/)
          )
          ls.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(nonSeedProjects))
        }
      } catch {
        ls.removeItem(STORAGE_KEYS.PROJECTS)
      }
    }

    // Filter out mock profiles (prof-1 to prof-10)
    const storedProfiles = ls.getItem(STORAGE_KEYS.PROFILES)
    if (storedProfiles) {
      try {
        const parsed = JSON.parse(storedProfiles)
        if (Array.isArray(parsed)) {
          const nonSeedProfiles = parsed.filter(
            (p: { id?: string }) => !p.id?.match(/^prof-\d+$/)
          )
          ls.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(nonSeedProfiles))
        }
      } catch {
        ls.removeItem(STORAGE_KEYS.PROFILES)
      }
    }

    // Legacy local auth/users mocks (now served by the API)
    ls.removeItem("software-estimation:users")
    ls.removeItem("software-estimation:password-reset")
    ls.removeItem("software-estimation:auth-tokens")

    // Remove mock backlog, story points, sprint configs, task hours, risks, reports for p1-p8
    for (let i = 1; i <= 8; i++) {
      const pid = `p${i}`
      ls.removeItem(`software-estimation:backlog:${pid}`)
      ls.removeItem(`software-estimation:story-points:${pid}`)
      ls.removeItem(`software-estimation:sprint-config:${pid}`)
      ls.removeItem(`software-estimation:task-hours:${pid}`)
      ls.removeItem(`risk_config_${pid}`)
      ls.removeItem(`reports_history_${pid}`)
    }

    ls.setItem(SEED_CLEANED_FLAG, "true")
  } catch (err) {
    console.error("Error purging mock seed data:", err)
  }
}
