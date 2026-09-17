export type TaskCostProfile = {
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
}

export type TaskCost = {
  taskId: string
  taskName: string
  totalHours: number
  profiles: TaskCostProfile[]
  totalCost: number
}
