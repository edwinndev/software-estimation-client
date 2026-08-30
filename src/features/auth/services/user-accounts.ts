import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import { UserRole, type User, type UserAccount } from "../types"
import { hashPassword } from "./password"

export const SEED_ADMIN_EMAIL = "jcvargas.dev@gmail.com"
export const SEED_ADMIN_PASSWORD = "admin123"

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const isAccountActive = (account: { isActive?: boolean }) =>
  account.isActive !== false

export const toUser = (account: UserAccount): User => ({
  id: account.id,
  firstName: account.firstName,
  lastName: account.lastName,
  email: account.email,
  role: account.role,
  isActive: isAccountActive(account),
  createdAt: account.createdAt,
})

export const readAccounts = async (): Promise<UserAccount[]> => {
  const stored = readJson<UserAccount[]>(STORAGE_KEYS.USERS)

  if (stored && stored.length > 0) {
    return stored
  }

  const admin: UserAccount = {
    id: "user-seed-admin",
    firstName: "Admin",
    lastName: "Sistema",
    email: SEED_ADMIN_EMAIL,
    passwordHash: await hashPassword(SEED_ADMIN_PASSWORD),
    role: UserRole.ADMIN.value,
    isActive: true,
    createdAt: new Date().toISOString(),
  }

  writeJson(STORAGE_KEYS.USERS, [admin])
  return [admin]
}

export const writeAccounts = (users: UserAccount[]) => {
  writeJson(STORAGE_KEYS.USERS, users)
}
