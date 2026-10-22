import { useQuery } from "@tanstack/react-query"
import { authService } from "../services/auth-service"
import {
  clearSession,
  hasAccessToken,
  readSession,
  sessionFromUser,
  writeSession,
} from "../utils/session"

export const authQueryKeys = {
  session: ["auth", "session"] as const,
}

const loadSession = async () => {
  if (!hasAccessToken()) {
    clearSession()
    return null
  }

  const cached = readSession()

  try {
    const user = await authService.getProfile()
    const session = sessionFromUser(user, cached?.permissions ?? [])
    writeSession(session)
    return session
  } catch {
    clearSession()
    return null
  }
}

export const useSession = () => {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: loadSession,
  })
}
