export type StoryStatus = "draft" | "ready" | "in-progress" | "done"
export type TaskStatus = "todo" | "in-progress" | "done"

export type TechnicalProfile = {
  id: string
  name: string
  role: string
  email: string
  hourlyRate: number
  isActive: boolean
}

export type MoveDirection = "up" | "down"

export interface UserStory {
  id: string
  projectId: string
  code: string
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

export interface BacklogData {
  stories: UserStory[]
  tasks: BacklogTask[]
}
