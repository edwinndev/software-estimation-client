import { useQuery } from "@tanstack/react-query"
import type { QueryRequest } from "@/types/api"
import { usersService } from "../services/users-service"
import type { UserSearchResponse } from "../types"

export const userQueryKeys = {
  all: ["users"] as const,
  list: (query: QueryRequest) => ["users", query] as const,
  detail: (userId: string) => ["users", userId] as const,
}

export const useUsers = (query: QueryRequest) => {
  return useQuery<UserSearchResponse>({
    queryKey: userQueryKeys.list(query),
    queryFn: () => usersService.getUsers(query),
    placeholderData: (previousData) => previousData,
  })
}
