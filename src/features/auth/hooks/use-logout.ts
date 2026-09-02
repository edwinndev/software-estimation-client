import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"
import { authQueryKeys } from "./use-session"

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session, null)
      queryClient.removeQueries({ queryKey: ["users"] })
      router.replace("/login")
    },
  })
}
