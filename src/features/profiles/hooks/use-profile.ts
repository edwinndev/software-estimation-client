import { useQuery } from "@tanstack/react-query"
import { profilesService } from "../services/profiles-service"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: [...PROFILES_QUERY_KEY, id],
    queryFn: () => profilesService.getProfile(id),
    enabled: Boolean(id),
  })
}
