import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"
import type { LoginRequest } from "../types"
import { saveAuth } from "../utils/session"
import { authQueryKeys } from "./use-session"

export const useLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: LoginRequest) => {
      const response = await authService.login(input)
      return saveAuth(response)
    },
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKeys.session, session)
      router.replace("/projects")
    },
  })
}
