export type UpdateUserRequest = {
  firstName: string
  lastName: string
  email: string
  roleId: string
  isActive?: boolean
}

export type UpdateUserPayload = UpdateUserRequest & {
  userId: string
}

export type UpdateUser = UpdateUserPayload
