import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersService } from "../services/users-service"
import { userQueryKeys } from "./use-users"

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}
