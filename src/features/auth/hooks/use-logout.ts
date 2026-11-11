import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getRefreshToken } from "@/lib/api"
import { authService } from "../services/auth-service"
import type { LogoutRequest } from "../types"
import { clearSession } from "../utils/session"
import { authQueryKeys } from "./use-session"

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload?: LogoutRequest) => {
      const refreshToken = payload?.refreshToken ?? getRefreshToken()
      try {
        await authService.logout(refreshToken ? { refreshToken } : undefined)
      } finally {
        clearSession()
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session, null)
      queryClient.removeQueries({ queryKey: ["users"] })
      router.replace("/login")
    },
  })
}
