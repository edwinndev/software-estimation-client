import type {
  BacklogTask,
  StoriesData,
  TechnicalProfile,
  UserStory,
} from "../types/stories-types"

const profiles: TechnicalProfile[] = [
  { id: "frontend", name: "Frontend" },
  { id: "backend", name: "Backend" },
  { id: "qa", name: "QA / Testing" },
  { id: "devops", name: "DevOps" },
]

const key = (projectId: string) => `software-estimation:backlog:${projectId}`
const read = (projectId: string): StoriesData => {
  if (typeof window === "undefined") return { stories: [], tasks: [] }
  const stored = window.localStorage.getItem(key(projectId))
  return stored
    ? (JSON.parse(stored) as StoriesData)
    : { stories: [], tasks: [] }
}
const write = (projectId: string, data: StoriesData) => {
  window.localStorage.setItem(key(projectId), JSON.stringify(data))
  return data
}
const now = () => new Date().toISOString()

export const storiesService = {
  getProfiles: async () => profiles,
  getStories: async (projectId: string) => read(projectId),
  createStory: async (
    projectId: string,
    values: Omit<UserStory, "id" | "projectId" | "createdAt" | "updatedAt">
  ) => {
    const timestamp = now()
    const story: UserStory = {
      ...values,
      id: crypto.randomUUID(),
      projectId,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    const data = read(projectId)
    return write(projectId, { ...data, stories: [story, ...data.stories] })
  },
  updateStory: async (
    projectId: string,
    id: string,
    values: Partial<UserStory>
  ) => {
    const data = read(projectId)
    return write(projectId, {
      ...data,
      stories: data.stories.map((story) =>
        story.id === id ? { ...story, ...values, updatedAt: now() } : story
      ),
    })
  },
  deleteStory: async (projectId: string, id: string) => {
    const data = read(projectId)
    return write(projectId, {
      stories: data.stories.filter((story) => story.id !== id),
      tasks: data.tasks.filter((task) => task.storyId !== id),
    })
  },
  createTask: async (
    projectId: string,
    storyId: string,
    values: Omit<BacklogTask, "id" | "storyId" | "createdAt" | "updatedAt">
  ) => {
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
    const data = read(projectId)
    return write(projectId, {
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === id ? { ...task, ...values, updatedAt: now() } : task
      ),
    })
  },
  deleteTask: async (projectId: string, id: string) => {
    const data = read(projectId)
    return write(projectId, {
      ...data,
      tasks: data.tasks.filter((task) => task.id !== id),
    })
  },
}
