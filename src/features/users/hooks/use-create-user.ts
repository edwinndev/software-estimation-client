import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersService } from "../services/users-service"
import { userQueryKeys } from "./use-users"

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}
