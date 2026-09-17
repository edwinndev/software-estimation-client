import { paginateQuery } from "@/lib/pagination"
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import { hashPassword } from "@/features/auth/services/password"
import {
  isAccountActive,
  normalizeEmail,
  readAccounts,
  toUser,
  writeAccounts,
} from "@/features/auth/services/user-accounts"
import {
  getRolePermissions,
  PERMISSIONS,
  type PermissionCode,
} from "@/features/auth/constants/permissions"
import { hasPermission } from "@/features/auth/utils/permission-utils"
import {
  getFullName,
  UserRole,
  type Session,
  type User,
  type UserAccount,
  type UserRoleValue,
} from "@/features/auth/types"
import {
  FilterOperator,
  type FilterRequest,
  type QueryRequest,
} from "@/types/api"
import type {
  CreateUser,
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  UpdateUser,
  UpdateUserResponse,
  UpdateUserStatus,
  UpdateUserStatusResponse,
  UserSearchResponse,
} from "../types"

const isAdminRole = (role: UserRoleValue) => role === UserRole.ADMIN.value

const readSession = () => readJson<Session>(STORAGE_KEYS.SESSION)

const requirePermission = (permission: PermissionCode) => {
  const session = readSession()

  if (
    !session ||
    !hasPermission(getRolePermissions(session.role), permission)
  ) {
    throw new Error("No tienes permisos para gestionar usuarios")
  }

  return session
}

const findStoredUser = (users: UserAccount[], userId: string) => {
  const user = users.find((item) => item.id === userId)

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  return user
}

const assertEmailAvailable = (
  users: UserAccount[],
  email: string,
  skipUserId: string
) => {
  const taken = users.some(
    (user) => user.email === email && user.id !== skipUserId
  )

  if (taken) {
    throw new Error("Ya existe un usuario con este correo electrónico")
  }
}

const assertAnotherAdminExists = (users: UserAccount[], skipUserId: string) => {
  const remaining = users.filter(
    (user) =>
      isAdminRole(user.role) && user.id !== skipUserId && isAccountActive(user)
  )

  if (remaining.length === 0) {
    throw new Error("Debe existir al menos un administrador activo")
  }
}

const getFieldValue = (user: User, key: string) => {
  if (key === "search") {
    return `${getFullName(user)} ${user.email}`.toLowerCase()
  }

  const value = user[key as keyof User]
  return String(value ?? "").toLowerCase()
}

const matchesFilter = (user: User, filter: FilterRequest) => {
  const field = getFieldValue(user, filter.key)
  const values = filter.values.map((value) => value.toLowerCase())

  if (filter.operator === FilterOperator.LK) {
    return values.some((value) => field.includes(value))
  }

  if (filter.operator === FilterOperator.EQ) {
    return values.includes(field)
  }

  if (filter.operator === FilterOperator.IN) {
    return values.includes(field)
  }

  if (filter.operator === FilterOperator.NE) {
    return !values.includes(field)
  }

  return true
}

const sortUsers = (users: User[], query: QueryRequest) => {
  const { orderBy, sortDirection } = query.pagination

  return [...users].sort((left, right) => {
    const leftValue = String(left[orderBy as keyof User] ?? "")
    const rightValue = String(right[orderBy as keyof User] ?? "")
    const comparison = leftValue.localeCompare(rightValue)

    return sortDirection === "DESC" ? -comparison : comparison
  })
}

const getUsers = async (query: QueryRequest): Promise<UserSearchResponse> => {
  requirePermission(PERMISSIONS.USER_READ)
  const users = await readAccounts()
  const filtered = users
    .map(toUser)
    .filter((user) =>
      query.filters.every((filter) => matchesFilter(user, filter))
    )

  return paginateQuery(
    sortUsers(filtered, query),
    query.pagination,
    "userResponse"
  )
}

const getUser = async (userId: string): Promise<GetUserResponse> => {
  requirePermission(PERMISSIONS.USER_READ)
  const users = await readAccounts()
  return toUser(findStoredUser(users, userId))
}

const createUser = async (input: CreateUser): Promise<CreateUserResponse> => {
  requirePermission(PERMISSIONS.USER_WRITE)

  const users = await readAccounts()
  const email = normalizeEmail(input.email)
  assertEmailAvailable(users, email, "")

  const user: UserAccount = {
    id: crypto.randomUUID(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    isActive: false,
    createdAt: new Date().toISOString(),
  }

  writeAccounts([...users, user])
  return toUser(user)
}

const updateUser = async (input: UpdateUser): Promise<UpdateUserResponse> => {
  const session = requirePermission(PERMISSIONS.USER_WRITE)
  const users = await readAccounts()
  const currentUser = findStoredUser(users, input.userId)

  if (session.userId === input.userId && currentUser.role !== input.role) {
    throw new Error("No puedes cambiar tu propio rol")
  }

  if (isAdminRole(currentUser.role) && !isAdminRole(input.role)) {
    assertAnotherAdminExists(users, currentUser.id)
  }

  const email = normalizeEmail(input.email)
  assertEmailAvailable(users, email, input.userId)

  const updatedUser: UserAccount = {
    ...currentUser,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    role: input.role,
    passwordHash: input.password
      ? await hashPassword(input.password)
      : currentUser.passwordHash,
  }

  writeAccounts(
    users.map((user) => (user.id === input.userId ? updatedUser : user))
  )

  if (session.userId === updatedUser.id) {
    writeJson(STORAGE_KEYS.SESSION, {
      userId: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
    })
  }

  return toUser(updatedUser)
}

const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  const session = requirePermission(PERMISSIONS.USER_DELETE)

  if (session.userId === userId) {
    throw new Error("No puedes eliminar tu propio usuario")
  }

  const users = await readAccounts()
  const currentUser = findStoredUser(users, userId)

  if (isAdminRole(currentUser.role)) {
    assertAnotherAdminExists(users, userId)
  }

  writeAccounts(users.filter((user) => user.id !== userId))
  return { userId }
}

const updateUserStatus = async (
  input: UpdateUserStatus
): Promise<UpdateUserStatusResponse> => {
  const session = requirePermission(PERMISSIONS.USER_WRITE)
  const users = await readAccounts()
  const currentUser = findStoredUser(users, input.userId)

  if (session.userId === input.userId) {
    throw new Error("No puedes cambiar el estado de tu propio usuario")
  }

  if (isAdminRole(currentUser.role) && !input.isActive) {
    assertAnotherAdminExists(users, currentUser.id)
  }

  const updatedUser: UserAccount = {
    ...currentUser,
    isActive: input.isActive,
  }

  writeAccounts(
    users.map((user) => (user.id === input.userId ? updatedUser : user))
  )

  return toUser(updatedUser)
}

export const usersService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
}
