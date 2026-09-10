import type {
  BacklogData,
  BacklogTask,
  TechnicalProfile,
  UserStory,
} from "../types/backlog-types"

const profiles: TechnicalProfile[] = [
  { id: "Frontend", name: "Frontend" },
  { id: "Backend", name: "Backend" },
  { id: "Fullstack", name: "Fullstack" },
  { id: "QA", name: "QA" },
  { id: "DevOps", name: "DevOps" },
  { id: "UI/UX Designer", name: "UI/UX Designer" },
  { id: "Product Manager", name: "Product Manager" },
  { id: "Tech Lead", name: "Tech Lead" },
  { id: "Functional Analyst", name: "Functional Analyst" },
  { id: "Other", name: "Other" },
]

const key = (projectId: string) => `software-estimation:backlog:${projectId}`

const read = (projectId: string): BacklogData => {
  if (typeof window === "undefined") return { stories: [], tasks: [] }
  const stored = window.localStorage.getItem(key(projectId))
  return stored
    ? (JSON.parse(stored) as BacklogData)
    : { stories: [], tasks: [] }
}

const write = (projectId: string, data: BacklogData) => {
  window.localStorage.setItem(key(projectId), JSON.stringify(data))
  return data
}

const now = () => new Date().toISOString()

export const backlogService = {
  getProfiles: async () => profiles,
  getBacklog: async (projectId: string) => read(projectId),
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
