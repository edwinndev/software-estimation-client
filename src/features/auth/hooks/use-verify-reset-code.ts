import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"
import type { VerifyResetCodeRequest } from "../types"

export const useVerifyResetCode = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (input: VerifyResetCodeRequest) =>
      authService.verifyResetCode(input),
    onSuccess: (_data, input) => {
      router.push(
        `/forgot-password/reset?email=${encodeURIComponent(input.email)}&code=${encodeURIComponent(input.code)}`
      )
    },
  })
}
