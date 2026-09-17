import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PROJECT_COSTS_QUERY_KEY } from "@/features/costs/hooks/use-project-costs"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { profilesService } from "../services/profiles-service"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => profilesService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: PROJECT_COSTS_QUERY_KEY })
      invalidateReportQueries(queryClient)
    },
  })
}
