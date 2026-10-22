import { apiClient, getAccessToken } from "@/lib/api"
import { readJson, removeJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import type { AuthResponse, Session, User } from "../types"

export const readSession = () => readJson<Session>(STORAGE_KEYS.SESSION)

export const writeSession = (session: Session) => {
  writeJson(STORAGE_KEYS.SESSION, session)
}

export const clearSession = () => {
  removeJson(STORAGE_KEYS.SESSION)
  apiClient.clearAuthTokens()
}

export const sessionFromUser = (
  user: User,
  permissions: string[]
): Session => ({
  userId: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.roleCode,
  roleId: user.roleId,
  roleName: user.roleName,
  permissions,
})

export const saveAuth = (payload: AuthResponse): Session => {
  apiClient.storeAuthTokens(payload)
  const session = sessionFromUser(payload.user, payload.permissions)
  writeSession(session)
  return session
}

export const hasAccessToken = () => Boolean(getAccessToken())
