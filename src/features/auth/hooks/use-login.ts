import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"
import { authQueryKeys } from "./use-session"

export const useLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKeys.session, session)
      router.replace("/projects")
    },
  })
}
