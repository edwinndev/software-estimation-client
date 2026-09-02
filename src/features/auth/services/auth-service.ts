import { readJson, removeJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import type {
  LoginInput,
  LoginResponse,
  PasswordReset,
  RequestPasswordReset,
  ResetPassword,
  Session,
  UserAccount,
  VerifyResetCode,
} from "../types"
import { hashPassword } from "./password"
import {
  isAccountActive,
  normalizeEmail,
  readAccounts,
  writeAccounts,
} from "./user-accounts"

export { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } from "./user-accounts"

const toSession = (account: UserAccount): Session => ({
  userId: account.id,
  firstName: account.firstName,
  lastName: account.lastName,
  email: account.email,
  role: account.role,
})

const getSession = async (): Promise<Session | null> => {
  const session = readJson<Session>(STORAGE_KEYS.SESSION)

  if (!session) {
    return null
  }

  const users = await readAccounts()
  const user = users.find((item) => item.id === session.userId)

  if (!user || !isAccountActive(user)) {
    removeJson(STORAGE_KEYS.SESSION)
    return null
  }

  const freshSession = toSession(user)
  writeJson(STORAGE_KEYS.SESSION, freshSession)
  return freshSession
}

const login = async (input: LoginInput): Promise<LoginResponse> => {
  const users = await readAccounts()
  const email = normalizeEmail(input.email)
  const user = users.find((item) => item.email === email)
  const passwordHash = await hashPassword(input.password)

  if (!user || user.passwordHash !== passwordHash) {
    throw new Error("Correo o contraseña incorrectos")
  }

  if (!isAccountActive(user)) {
    throw new Error("Esta cuenta está desactivada")
  }

  const session = toSession(user)
  writeJson(STORAGE_KEYS.SESSION, session)
  return session
}

const logout = async () => {
  removeJson(STORAGE_KEYS.SESSION)
}

const getReset = () => readJson<PasswordReset>(STORAGE_KEYS.PASSWORD_RESET)

const requestPasswordReset = async (input: RequestPasswordReset) => {
  const email = normalizeEmail(input.email)
  const users = await readAccounts()
  const user = users.find((item) => item.email === email)

  if (!user) {
    throw new Error("No existe una cuenta con este correo electrónico")
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const reset: PasswordReset = {
    email,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    verified: false,
  }

  writeJson(STORAGE_KEYS.PASSWORD_RESET, reset)
  console.info("[OTP] Password reset code", { email, code })
}

const verifyResetCode = async (input: VerifyResetCode) => {
  const email = normalizeEmail(input.email)
  const reset = getReset()

  if (!reset || reset.email !== email) {
    throw new Error("Solicita un código de verificación primero")
  }

  if (Date.now() > reset.expiresAt) {
    removeJson(STORAGE_KEYS.PASSWORD_RESET)
    throw new Error("El código expiró. Solicita uno nuevo")
  }

  if (reset.code !== input.code.trim()) {
    throw new Error("El código no es válido")
  }

  writeJson(STORAGE_KEYS.PASSWORD_RESET, {
    ...reset,
    verified: true,
  })
}

const resetPassword = async (input: ResetPassword) => {
  const email = normalizeEmail(input.email)
  const reset = getReset()

  if (!reset || reset.email !== email || !reset.verified) {
    throw new Error("Debes verificar el código primero")
  }

  if (Date.now() > reset.expiresAt) {
    removeJson(STORAGE_KEYS.PASSWORD_RESET)
    throw new Error("El código expiró. Solicita uno nuevo")
  }

  const users = await readAccounts()
  const user = users.find((item) => item.email === email)

  if (!user) {
    throw new Error("No existe una cuenta con este correo electrónico")
  }

  const passwordHash = await hashPassword(input.password)

  writeAccounts(
    users.map((item) =>
      item.id === user.id ? { ...item, passwordHash } : item
    )
  )
  removeJson(STORAGE_KEYS.PASSWORD_RESET)
}

export const authService = {
  getSession,
  login,
  logout,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
}
