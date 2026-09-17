import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { reportsService } from "../services/reports.service"
import { downloadProjectReportPdf } from "../services/report-pdf.service"
import type { ReportSnapshot } from "../types"
import { REPORTS_QUERY_KEY, invalidateReportQueries } from "./query-keys"

export const useLatestEstimate = (projectId: string) => {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "latest", projectId],
    queryFn: () => reportsService.getLatestEstimate(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

export const useReportsHistory = (projectId: string) => {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "history", projectId],
    queryFn: () => reportsService.getHistory(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

export const useSaveReportSnapshot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (snapshot: ReportSnapshot) =>
      reportsService.saveSnapshot(snapshot),
    onSuccess: () => {
      invalidateReportQueries(queryClient)
    },
  })
}

export const useExportProjectReportPdf = () => {
  return useMutation({
    mutationFn: (snapshot: ReportSnapshot) =>
      downloadProjectReportPdf(snapshot),
  })
}
