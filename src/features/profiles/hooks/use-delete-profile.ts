import { useMutation, useQueryClient } from "@tanstack/react-query"
import { profilesService } from "../services/profiles-service"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => profilesService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
    },
  })
}
