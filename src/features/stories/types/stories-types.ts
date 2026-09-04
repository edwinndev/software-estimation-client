export type StoryStatus = "draft" | "ready" | "in-progress" | "done"
export type TaskStatus = "todo" | "in-progress" | "done"

export interface TechnicalProfile {
  id: string
  name: string
}

export interface UserStory {
  id: string
  projectId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: StoryStatus
  createdAt: string
  updatedAt: string
}

export interface BacklogTask {
  id: string
  storyId: string
  title: string
  description: string
  estimate: number
  status: TaskStatus
  profileIds: string[]
  createdAt: string
  updatedAt: string
}

export interface StoriesData {
  stories: UserStory[]
  tasks: BacklogTask[]
}
