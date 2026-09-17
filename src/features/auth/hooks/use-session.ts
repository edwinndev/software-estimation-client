import { useQuery } from "@tanstack/react-query"
import { authService } from "../services/auth-service"

export const authQueryKeys = {
  session: ["auth", "session"] as const,
}

export const useSession = () => {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: authService.getSession,
  })
}
