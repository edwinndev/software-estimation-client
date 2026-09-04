import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"

export const useVerifyResetCode = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.verifyResetCode,
    onSuccess: (_data, input) => {
      router.push(
        `/forgot-password/reset?email=${encodeURIComponent(input.email)}`
      )
    },
  })
}
