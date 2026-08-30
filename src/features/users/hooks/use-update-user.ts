import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authQueryKeys } from "@/features/auth/hooks/use-session"
import { usersService } from "../services/users-service"
import { userQueryKeys } from "./use-users"

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.updateUser,
    onSuccess: (_user, input) => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
      void queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(input.userId),
      })
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.session })
    },
  })
}
