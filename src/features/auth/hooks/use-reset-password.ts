import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"
import type { ResetPasswordRequest } from "../types"

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (input: ResetPasswordRequest) =>
      authService.resetPassword(input),
    onSuccess: () => {
      router.replace("/login")
    },
  })
}
