import { useMutation, useQueryClient } from "@tanstack/react-query"
import { profilesService } from "../services/profiles-service"
import type { UpdateProfilePayload } from "../types"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profilesService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
    },
  })
}
