import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reportsService } from "../services/reports.service"
import { ReportSnapshot } from "../types"

const REPORTS_KEYS = {
  all: ["reports"] as const,
  latest: (projectId: string) =>
    [...REPORTS_KEYS.all, "latest", projectId] as const,
  history: (projectId: string) =>
    [...REPORTS_KEYS.all, "history", projectId] as const,
}

export const useLatestEstimate = (projectId: string) => {
  return useQuery({
    queryKey: REPORTS_KEYS.latest(projectId),
    queryFn: () => reportsService.getLatestEstimate(projectId),
  })
}

export const useReportsHistory = (projectId: string) => {
  return useQuery({
    queryKey: REPORTS_KEYS.history(projectId),
    queryFn: () => reportsService.getHistory(projectId),
  })
}

export const useSaveReportSnapshot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (snapshot: ReportSnapshot) =>
      reportsService.saveSnapshot(snapshot),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: REPORTS_KEYS.history(variables.projectId),
      })
    },
  })
}
