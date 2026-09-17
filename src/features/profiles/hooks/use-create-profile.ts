import { useMutation, useQueryClient } from "@tanstack/react-query"
import { profilesService } from "../services/profiles-service"
import type { CreateProfilePayload } from "../types"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useCreateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProfilePayload) =>
      profilesService.createProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
    },
  })
}
