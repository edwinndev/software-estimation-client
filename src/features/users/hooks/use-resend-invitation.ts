import { useMutation } from "@tanstack/react-query"
import { usersService } from "../services/users-service"

export const useResendInvitation = () => {
  return useMutation({
    mutationFn: (userId: string) => usersService.resendInvitation(userId),
  })
}
