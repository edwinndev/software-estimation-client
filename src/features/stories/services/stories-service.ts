import { profilesService } from "@/features/profiles/services/profiles-service"
import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import type { QueryRequest } from "@/types/api"
import { nextStoryCode } from "@/lib/story-code"
import type {
  BacklogData,
  BacklogTask,
  MoveDirection,
  TechnicalProfile,
  UserStory,
} from "../types/story-types"

const key = (projectId: string) => `software-estimation:backlog:${projectId}`

const read = (projectId: string): BacklogData => {
  if (typeof window === "undefined") return { stories: [], tasks: [] }
  const stored = window.localStorage.getItem(key(projectId))
  if (!stored) return { stories: [], tasks: [] }

  const parsed = JSON.parse(stored) as BacklogData
  const stories = Array.isArray(parsed.stories) ? parsed.stories : []
  const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : []

  return {
    stories: stories.map((story) => ({
      ...story,
      code: typeof story.code === "string" ? story.code : "",
    })),
    tasks,
  }
}

const write = (projectId: string, data: BacklogData) => {
  window.localStorage.setItem(key(projectId), JSON.stringify(data))
  return data
}

const ensureStoryCodes = (projectId: string): BacklogData => {
  const data = read(projectId)
  const missing = data.stories.some((story) => story.code.length === 0)
  if (!missing) {
    return data
  }

  const assigned = data.stories.map((story) => story.code)
  const stories = data.stories.map((story) => {
    if (story.code.length > 0) {
      return story
    }

    const code = nextStoryCode(assigned)
    assigned.push(code)
    return { ...story, code }
  })

  return write(projectId, { ...data, stories })
}

const now = () => new Date().toISOString()

const swapAt = <T>(items: T[], from: number, to: number) => {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items
  }

  const next = [...items]
  const current = next[from]
  const target = next[to]
  if (!current || !target) {
    return items
  }

  next[from] = target
  next[to] = current
  return next
}

const moveById = <T extends { id: string }>(
  items: T[],
  id: string,
  direction: MoveDirection
) => {
  const index = items.findIndex((item) => item.id === id)
  const target = direction === "up" ? index - 1 : index + 1
  return swapAt(items, index, target)
}

const listAssignableProfiles = async (): Promise<TechnicalProfile[]> => {
  const collected: TechnicalProfile[] = []
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
    page.profilesResponse.forEach((profile) => {
      collected.push({
        id: profile.id,
        name: profile.name,
        role: profile.role,
        email: typeof profile.email === "string" ? profile.email : "",
        hourlyRate: profile.hourlyRate,
        isActive: profile.isActive === false ? false : true,
      })
    })
    hasNext = page.hasNext
    pageNumber += 1
  }

  return collected
}

export const storiesService = {
  getProfiles: listAssignableProfiles,
  getStories: async (projectId: string) => ensureStoryCodes(projectId),
  createStory: async (
    projectId: string,
    values: Omit<
      UserStory,
      "id" | "projectId" | "code" | "createdAt" | "updatedAt"
    >
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = ensureStoryCodes(projectId)
    const timestamp = now()
    const story: UserStory = {
      ...values,
      id: crypto.randomUUID(),
      projectId,
      code: nextStoryCode(data.stories.map((item) => item.code)),
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    return write(projectId, { ...data, stories: [...data.stories, story] })
  },
  updateStory: async (
    projectId: string,
    id: string,
    values: Partial<UserStory>
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = read(projectId)
    return write(projectId, {
      ...data,
      stories: data.stories.map((story) =>
        story.id === id
          ? { ...story, ...values, code: story.code, updatedAt: now() }
          : story
      ),
    })
  },
  deleteStory: async (projectId: string, id: string) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = read(projectId)
    return write(projectId, {
      stories: data.stories.filter((story) => story.id !== id),
      tasks: data.tasks.filter((task) => task.storyId !== id),
    })
  },
  moveStory: async (
    projectId: string,
    id: string,
    direction: MoveDirection
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = read(projectId)
    return write(projectId, {
      ...data,
      stories: moveById(data.stories, id, direction),
    })
  },
  createTask: async (
    projectId: string,
    storyId: string,
    values: Omit<BacklogTask, "id" | "storyId" | "createdAt" | "updatedAt">
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const timestamp = now()
    const task: BacklogTask = {
      ...values,
      id: crypto.randomUUID(),
      storyId,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    const data = read(projectId)
    return write(projectId, { ...data, tasks: [...data.tasks, task] })
  },
  updateTask: async (
    projectId: string,
    id: string,
    values: Partial<BacklogTask>
  ) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = read(projectId)
    return write(projectId, {
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === id ? { ...task, ...values, updatedAt: now() } : task
      ),
    })
  },
  deleteTask: async (projectId: string, id: string) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = read(projectId)
    return write(projectId, {
      ...data,
      tasks: data.tasks.filter((task) => task.id !== id),
    })
  },
  moveTask: async (projectId: string, id: string, direction: MoveDirection) => {
    await requireProjectAction(projectId, "editBacklog")
    const data = read(projectId)
    const taskIndex = data.tasks.findIndex((task) => task.id === id)
    if (taskIndex < 0) {
      return data
    }

    const task = data.tasks[taskIndex]
    if (!task) {
      return data
    }

    const siblingIndexes = data.tasks.reduce<number[]>(
      (indexes, item, index) => {
        if (item.storyId === task.storyId) {
          indexes.push(index)
        }
        return indexes
      },
      []
    )
    const localIndex = siblingIndexes.indexOf(taskIndex)
    const targetLocal = direction === "up" ? localIndex - 1 : localIndex + 1
    if (targetLocal < 0 || targetLocal >= siblingIndexes.length) {
      return data
    }

    const targetIndex = siblingIndexes[targetLocal]
    if (targetIndex === undefined) {
      return data
    }

    return write(projectId, {
      ...data,
      tasks: swapAt(data.tasks, taskIndex, targetIndex),
    })
  },
}
