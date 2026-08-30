import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"

export const useRequestPasswordReset = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.requestPasswordReset,
    onSuccess: (_data, input) => {
      router.push(
        `/forgot-password/verify?email=${encodeURIComponent(input.email)}`
      )
    },
  })
}
