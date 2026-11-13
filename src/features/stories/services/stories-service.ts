import { profilesService } from "@/features/profiles/services/profiles-service"
import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import {
  FilterOperator,
  type FilterRequest,
  type PaginatedResponse,
  type QueryRequest,
} from "@/types/api"
import { apiClient } from "@/lib/api"
import type {
  BacklogData,
  BacklogTask,
  MoveDirection,
  TechnicalProfile,
  UserStory,
} from "../types/story-types"

const PAGE_SIZE = 100

type BacklogFilters = {
  search?: string
  priority?: UserStory["priority"] | ""
  status?: UserStory["status"] | ""
}

type UserStoryResponse = {
  id: string
  projectId: string
  code: string
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "DRAFT" | "READY" | "IN_PROGRESS" | "DONE"
  storyPoints: number | null
  position: number
  createdAt: string
  updatedAt: string | null
}

type TechnicalTaskResponse = {
  id: string
  storyId: string
  title: string
  description: string
  estimateHours: number
  status: "TODO" | "IN_PROGRESS" | "DONE"
  position: number
  profileIds: string[]
  createdAt: string
  updatedAt: string | null
}

type UserStoryWrite = Pick<
  UserStory,
  "title" | "description" | "priority" | "status"
> & { position?: number }

type TechnicalTaskWrite = Pick<
  BacklogTask,
  "title" | "description" | "estimate" | "status"
> & { position?: number }

const storyPriorityFromApi: Record<
  UserStoryResponse["priority"],
  UserStory["priority"]
> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
}

const storyStatusFromApi: Record<
  UserStoryResponse["status"],
  UserStory["status"]
> = {
  DRAFT: "draft",
  READY: "ready",
  IN_PROGRESS: "in-progress",
  DONE: "done",
}

const taskStatusFromApi: Record<
  TechnicalTaskResponse["status"],
  BacklogTask["status"]
> = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
}

const apiEnumValue = (value: string) => value.toUpperCase().replace(/-/g, "_")

const toUserStory = (story: UserStoryResponse): UserStory => ({
  ...story,
  priority: storyPriorityFromApi[story.priority],
  status: storyStatusFromApi[story.status],
  updatedAt: story.updatedAt ?? story.createdAt,
})

const toTechnicalTask = (task: TechnicalTaskResponse): BacklogTask => ({
  id: task.id,
  storyId: task.storyId,
  title: task.title,
  description: task.description,
  estimate: task.estimateHours,
  status: taskStatusFromApi[task.status],
  profileIds: task.profileIds,
  position: task.position,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt ?? task.createdAt,
})

const toQueryRequest = (filters: FilterRequest[]): QueryRequest => ({
  filters,
  pagination: {
    pageNumber: 0,
    pageSize: PAGE_SIZE,
    orderBy: "position",
    sortDirection: "ASC",
  },
})

const getProfiles = async (): Promise<TechnicalProfile[]> => {
  const profiles: TechnicalProfile[] = []
  let pageNumber = 0
  let hasNext = true

  while (hasNext) {
    const page = await profilesService.getProfiles({
      filters: [],
      pagination: {
        pageNumber,
        pageSize: PAGE_SIZE,
        orderBy: "createdAt",
        sortDirection: "DESC",
      },
    })
    page.profilesResponse.forEach((profile) => {
      profiles.push({
        id: profile.id,
        name: profile.name,
        role: profile.role,
        email: typeof profile.email === "string" ? profile.email : "",
        hourlyRate: profile.hourlyRate,
        isActive: profile.isActive !== false,
      })
    })
    hasNext = page.hasNext
    pageNumber += 1
  }

  return profiles
}

const storyFilters = (
  filters: BacklogFilters,
  includeSearch: boolean
): FilterRequest[] => {
  const queryFilters: FilterRequest[] = []
  const search = filters.search?.trim()

  if (includeSearch && search) {
    queryFilters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [search],
    })
  }
  if (filters.priority) {
    queryFilters.push({
      key: "priority",
      operator: FilterOperator.EQ,
      values: [apiEnumValue(filters.priority)],
    })
  }
  if (filters.status) {
    queryFilters.push({
      key: "status",
      operator: FilterOperator.EQ,
      values: [apiEnumValue(filters.status)],
    })
  }

  return queryFilters
}

const getAllStories = async (
  projectId: string,
  filters: FilterRequest[]
): Promise<UserStory[]> => {
  const stories: UserStory[] = []
  let request = toQueryRequest(filters)
  let hasNext = true

  while (hasNext) {
    const page = await apiClient.post<
      PaginatedResponse<UserStoryResponse, "userStoryResponse">
    >(`/api/v1/projects/${projectId}/user-stories/search`, request)
    stories.push(...page.userStoryResponse.map(toUserStory))
    hasNext = page.hasNext
    request = {
      ...request,
      pagination: {
        ...request.pagination,
        pageNumber: request.pagination.pageNumber + 1,
      },
    }
  }

  return stories
}

const getAllTasks = async (
  storyIds: string[],
  search?: string
): Promise<BacklogTask[]> => {
  if (storyIds.length === 0) {
    return []
  }

  const filters: FilterRequest[] = [
    { key: "storyId", operator: FilterOperator.IN, values: storyIds },
  ]
  if (search?.trim()) {
    filters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [search.trim()],
    })
  }

  let request = toQueryRequest(filters)
  const tasks: BacklogTask[] = []
  let hasNext = true

  while (hasNext) {
    const page = await apiClient.post<
      PaginatedResponse<TechnicalTaskResponse, "taskResponse">
    >("/api/v1/tasks/search", request)
    tasks.push(...page.taskResponse.map(toTechnicalTask))
    hasNext = page.hasNext
    request = {
      ...request,
      pagination: {
        ...request.pagination,
        pageNumber: request.pagination.pageNumber + 1,
      },
    }
  }

  return tasks
}

const getStories = async (
  projectId: string,
  filters: BacklogFilters = {}
): Promise<BacklogData> => {
  const search = filters.search?.trim() ?? ""
  const criteria = storyFilters(filters, false)
  const stories = await getAllStories(projectId, criteria)
  const matchingStories = search
    ? await getAllStories(projectId, storyFilters(filters, true))
    : stories
  const tasks = await getAllTasks(
    stories.map((story) => story.id),
    search
  )

  if (!search) {
    return { stories, tasks }
  }

  const visibleStoryIds = new Set([
    ...matchingStories.map((story) => story.id),
    ...tasks.map((task) => task.storyId),
  ])
  return {
    stories: stories.filter((story) => visibleStoryIds.has(story.id)),
    tasks,
  }
}

const toStoryWrite = (values: UserStoryWrite) => ({
  title: values.title,
  description: values.description,
  priority: apiEnumValue(values.priority),
  status: apiEnumValue(values.status),
  ...(values.position === undefined ? {} : { position: values.position }),
})

const toTaskWrite = (values: TechnicalTaskWrite) => ({
  title: values.title,
  description: values.description,
  estimateHours: values.estimate,
  status: apiEnumValue(values.status),
  ...(values.position === undefined ? {} : { position: values.position }),
})

const reorderPosition = (
  position: number,
  direction: MoveDirection,
  lastPosition: number
) =>
  Math.max(0, Math.min(lastPosition, position + (direction === "up" ? -1 : 1)))

export const storiesService = {
  getProfiles,
  getStories,
  createStory: async (projectId: string, values: UserStoryWrite) => {
    await requireProjectAction(projectId, "editBacklog")
    const response = await apiClient.post<UserStoryResponse>(
      `/api/v1/projects/${projectId}/user-stories`,
      toStoryWrite(values)
    )
    return toUserStory(response)
  },
  updateStory: async (
    projectId: string,
    id: string,
    values: UserStoryWrite
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const response = await apiClient.put<UserStoryResponse>(
      `/api/v1/user-stories/${id}`,
      toStoryWrite(values)
    )
    return toUserStory(response)
  },
  deleteStory: async (projectId: string, id: string) => {
    await requireProjectAction(projectId, "editBacklog")
    return apiClient.delete(`/api/v1/user-stories/${id}`)
  },
  moveStory: async (
    projectId: string,
    id: string,
    direction: MoveDirection
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const { stories } = await getStories(projectId)
    const index = stories.findIndex((story) => story.id === id)
    if (index < 0) {
      throw new Error("Historia no encontrada en el backlog")
    }
    const story = stories[index]
    if (!story) {
      return
    }
    const position = reorderPosition(index, direction, stories.length - 1)
    const response = await apiClient.put<UserStoryResponse>(
      `/api/v1/user-stories/${id}`,
      toStoryWrite({ ...story, position })
    )
    return toUserStory(response)
  },
  createTask: async (
    projectId: string,
    storyId: string,
    values: Omit<
      BacklogTask,
      "id" | "storyId" | "createdAt" | "updatedAt" | "position"
    >
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const response = await apiClient.post<TechnicalTaskResponse>(
      "/api/v1/tasks",
      {
        storyId,
        ...toTaskWrite(values),
      }
    )
    try {
      await apiClient.put(`/api/v1/tasks/${response.id}/responsibles`, {
        profileIds: values.profileIds,
      })
    } catch (error) {
      try {
        await apiClient.delete(`/api/v1/tasks/${response.id}`)
      } catch (cleanupError) {
        const cause =
          error instanceof Error ? error.message : "Error desconocido"
        const cleanup =
          cleanupError instanceof Error
            ? cleanupError.message
            : "Error desconocido"
        throw new Error(
          `No se pudieron asignar los responsables (${cause}) ni revertir la tarea creada (${cleanup}).`
        )
      }
      throw error
    }
    return toTechnicalTask(response)
  },
  updateTask: async (
    projectId: string,
    id: string,
    values: Omit<
      BacklogTask,
      "id" | "storyId" | "createdAt" | "updatedAt" | "position"
    >
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const response = await apiClient.put<TechnicalTaskResponse>(
      `/api/v1/tasks/${id}`,
      toTaskWrite(values)
    )
    await apiClient.put(`/api/v1/tasks/${id}/responsibles`, {
      profileIds: values.profileIds,
    })
    return toTechnicalTask(response)
  },
  deleteTask: async (projectId: string, id: string) => {
    await requireProjectAction(projectId, "editBacklog")
    return apiClient.delete(`/api/v1/tasks/${id}`)
  },
  moveTask: async (projectId: string, id: string, direction: MoveDirection) => {
    await requireProjectAction(projectId, "editBacklog")
    const backlog = await getStories(projectId)
    const task = backlog.tasks.find((item) => item.id === id)
    if (!task) {
      throw new Error("Tarea técnica no encontrada en el backlog")
    }
    const siblings = backlog.tasks
      .filter((item) => item.storyId === task.storyId)
      .sort((left, right) => left.position - right.position)
    const index = siblings.findIndex((item) => item.id === id)
    const position = reorderPosition(index, direction, siblings.length - 1)
    const response = await apiClient.put<TechnicalTaskResponse>(
      `/api/v1/tasks/${id}`,
      {
        ...toTaskWrite(task),
        position,
      }
    )
    return toTechnicalTask(response)
  },
}
