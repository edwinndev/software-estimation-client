import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import { profilesService } from "@/features/profiles/services/profiles-service"
import { storiesService } from "@/features/stories/services/stories-service"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import type { Profile } from "@/features/profiles/types"
import type { QueryRequest } from "@/types/api"
import type { TaskHourEntry, UpdateTaskHoursInput } from "../types"

const OVERRIDES_KEY = (projectId: string) =>
  `software-estimation:task-hours:${projectId}`
const UNASSIGNED_PROFILE_ID = "unassigned"
const UNASSIGNED_PROFILE_NAME = "Sin perfil técnico"
const SIMULATED_DELAY_MS = 200

type HourOverride = {
  hours: number
  adjustmentReason: string
  updatedAt: string
}

type HourOverrides = Record<string, HourOverride>

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const overrideKey = (taskId: string, profileId: string) =>
  `${taskId}:${profileId}`

const readOverrides = (projectId: string): HourOverrides => {
  if (typeof window === "undefined") {
    return {}
  }

  const raw = window.localStorage.getItem(OVERRIDES_KEY(projectId))
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as HourOverrides
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

const writeOverrides = (projectId: string, overrides: HourOverrides) => {
  window.localStorage.setItem(
    OVERRIDES_KEY(projectId),
    JSON.stringify(overrides)
  )
}

const splitHours = (total: number, count: number): number[] => {
  if (count <= 1) {
    return [Number(total.toFixed(2))]
  }

  const base = Number((total / count).toFixed(2))
  const parts = Array.from({ length: count }, () => base)
  const used = base * (count - 1)
  parts[count - 1] = Number((total - used).toFixed(2))
  return parts
}

const listActiveProfiles = async (): Promise<Profile[]> => {
  const collected: Profile[] = []
  let pageNumber = 0
  let hasNext = true

  while (hasNext) {
    const query: QueryRequest = {
      filters: [],
      pagination: {
        pageNumber,
        pageSize: TABLE_PAGE_SIZE,
        orderBy: "createdAt",
        sortDirection: "DESC",
      },
    }
    const page = await profilesService.getProfiles(query)
    collected.push(...page.profilesResponse)
    hasNext = page.hasNext
    pageNumber += 1
  }

  return collected.filter((profile) => profile.isActive)
}

const resolveProfileName = (profileId: string, profiles: Profile[]): string => {
  if (profileId === UNASSIGNED_PROFILE_ID) {
    return UNASSIGNED_PROFILE_NAME
  }

  const byId = profiles.find((profile) => profile.id === profileId)
  if (byId) {
    return byId.name
  }

  const byRole = profiles.find((profile) => profile.role === profileId)
  if (byRole) {
    return byRole.name
  }

  return profileId
}

export const getTaskHourEntries = async (
  projectId: string
): Promise<TaskHourEntry[]> => {
  if (typeof window === "undefined") {
    return []
  }

  const backlog = await storiesService.getStories(projectId)
  const profiles = await listActiveProfiles()
  const overrides = readOverrides(projectId)
  const entries: TaskHourEntry[] = []

  for (const story of backlog.stories) {
    const tasks = backlog.tasks.filter((task) => task.storyId === story.id)

    for (const task of tasks) {
      const profileIds =
        task.profileIds.length > 0 ? task.profileIds : [UNASSIGNED_PROFILE_ID]
      const automaticHours = splitHours(task.estimate, profileIds.length)

      profileIds.forEach((profileId, index) => {
        const key = overrideKey(task.id, profileId)
        const override = overrides[key]
        const autoHours = automaticHours[index] ?? 0

        entries.push({
          id: key,
          projectId,
          storyId: story.id,
          storyCode: story.code,
          storyTitle: story.title,
          taskId: task.id,
          taskTitle: task.title,
          profileId,
          profileName: resolveProfileName(profileId, profiles),
          estimatedHours: override ? override.hours : autoHours,
          isAutomatic: !override,
          adjustmentReason: override ? override.adjustmentReason : "",
          updatedAt: override ? override.updatedAt : task.updatedAt,
        })
      })
    }
  }

  return entries
}

export const updateTaskHours = async (
  projectId: string,
  input: UpdateTaskHoursInput
): Promise<TaskHourEntry[]> => {
  await requireProjectAction(projectId, "editEstimation")
  await delay(SIMULATED_DELAY_MS)

  const overrides = readOverrides(projectId)
  const key = overrideKey(input.taskId, input.profileId)
  overrides[key] = {
    hours: input.hours,
    adjustmentReason: input.adjustmentReason,
    updatedAt: new Date().toISOString(),
  }
  writeOverrides(projectId, overrides)

  return getTaskHourEntries(projectId)
}

export const taskHoursService = {
  getTaskHourEntries,
  updateTaskHours,
}
