import { useQuery } from "@tanstack/react-query"
import type { QueryRequest } from "@/types/api"
import { profilesService } from "../services/profiles-service"

export const PROFILES_QUERY_KEY = ["profiles"]

export const useProfiles = (query?: QueryRequest) => {
  return useQuery({
    queryKey: [...PROFILES_QUERY_KEY, query],
    queryFn: () => profilesService.getProfiles(query),
  })
}
