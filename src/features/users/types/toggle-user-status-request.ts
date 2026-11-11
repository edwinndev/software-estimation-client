export type ToggleUserStatusRequest = {
  isActive: boolean
}

export type ToggleUserStatusPayload = ToggleUserStatusRequest & {
  userId: string
}

export type UpdateUserStatus = ToggleUserStatusPayload
