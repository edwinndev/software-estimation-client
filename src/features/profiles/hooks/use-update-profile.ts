import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PROJECT_COSTS_QUERY_KEY } from "@/features/costs/hooks/use-project-costs"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
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
      queryClient.invalidateQueries({ queryKey: PROJECT_COSTS_QUERY_KEY })
      invalidateReportQueries(queryClient)
    },
  })
}
