import { useQuery } from "@tanstack/react-query"
import { usersService } from "../services/users-service"
import { userQueryKeys } from "./use-users"

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => usersService.getUser(userId),
  })
}
