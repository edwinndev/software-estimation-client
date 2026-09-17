import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "../services/auth-service"

export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      router.replace("/login")
    },
  })
}
