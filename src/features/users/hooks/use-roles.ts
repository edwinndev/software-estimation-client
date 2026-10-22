import { useQuery } from "@tanstack/react-query"
import { rolesService } from "../services/roles-service"

export const roleQueryKeys = {
  all: ["roles"] as const,
  list: (activeOnly: boolean) => [...roleQueryKeys.all, activeOnly] as const,
}

export const useRoles = (activeOnly = true) => {
  return useQuery({
    queryKey: roleQueryKeys.list(activeOnly),
    queryFn: () => rolesService.getRoles(activeOnly),
  })
}
