import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"
import type { RequestPasswordResetRequest } from "../types"

export const useRequestPasswordReset = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (input: RequestPasswordResetRequest) =>
      authService.requestPasswordReset(input),
    onSuccess: (_data, input) => {
      router.push(
        `/forgot-password/verify?email=${encodeURIComponent(input.email)}`
      )
    },
  })
}
