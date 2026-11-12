export type CreateUserRequest = {
  firstName: string
  lastName: string
  email: string
  roleId: string
  isActive?: boolean
}

export type CreateUser = CreateUserRequest
