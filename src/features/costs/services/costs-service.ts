import { getTaskHourEntries } from "@/features/estimates/services/task-hours.service"
import { CURRENCY_CODE } from "@/lib/format"
import { readJson, STORAGE_KEYS } from "@/lib/storage"
import type { Profile } from "@/features/profiles/types"
import type { NormalizedCostAssignment } from "../types/cost-adapter"
import type { ProjectCostSummary } from "../types/project-cost-summary"
import { calculateCostSummary } from "../utils/calculate-cost-summary"

const UNASSIGNED_PROFILE_ID = "unassigned"

const EMPTY_SUMMARY: ProjectCostSummary = {
  taskCosts: [],
  profileBreakdown: [],
  totalCost: 0,
}

const toHourlyRate = (value: unknown): number => {
  const rate = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(rate) || rate < 0) {
    return 0
  }
  return rate
}

const readProfiles = (): Profile[] => {
  const data = readJson<Profile[]>(STORAGE_KEYS.PROFILES)
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((profile) => ({
    ...profile,
    email: typeof profile.email === "string" ? profile.email : "",
    hourlyRate: toHourlyRate(profile.hourlyRate),
    currency: CURRENCY_CODE,
    isActive: profile.isActive === false ? false : true,
  }))
}

const resolveProfile = (
  profileId: string,
  profiles: Profile[]
): Profile | null => {
  const match = profiles.find((profile) => profile.id === profileId)
  if (!match) {
    return null
  }
  return match
}

export const getProjectCostSummary = async (
  projectId: string
): Promise<ProjectCostSummary> => {
  if (typeof window === "undefined") {
    return EMPTY_SUMMARY
  }

  const hourEntries = await getTaskHourEntries(projectId)
  const profiles = readProfiles()
  const assignments: NormalizedCostAssignment[] = []

  hourEntries.forEach((entry) => {
    if (entry.profileId === UNASSIGNED_PROFILE_ID) {
      return
    }

    const hours = toHourlyRate(entry.estimatedHours)
    if (hours <= 0) {
      return
    }

    const profile = resolveProfile(entry.profileId, profiles)
    if (!profile) {
      return
    }

    assignments.push({
      taskId: entry.taskId,
      taskName: entry.taskTitle,
      profileId: profile.id,
      profileName: profile.name,
      profileRole: profile.role,
      profileEmail: typeof profile.email === "string" ? profile.email : "",
      estimatedHours: hours,
      cer: profile.hourlyRate,
    })
  })

  if (assignments.length === 0) {
    return EMPTY_SUMMARY
  }

  return calculateCostSummary(assignments)
}

export const costsService = {
  getProjectCostSummary,
}
