import { useMutation, useQuery } from "@tanstack/react-query"
import { globalReportsService } from "../services/global-reports.service"
import { downloadSystemReportPdf } from "../services/report-pdf.service"
import type { GlobalSystemReport } from "../types"
import { GLOBAL_REPORTS_QUERY_KEY } from "./query-keys"

export const useGlobalSystemReports = () => {
  return useQuery({
    queryKey: [...GLOBAL_REPORTS_QUERY_KEY, "system"],
    queryFn: () => globalReportsService.getGlobalSystemReport(),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

export const useExportSystemReportPdf = () => {
  return useMutation({
    mutationFn: (report: GlobalSystemReport) => downloadSystemReportPdf(report),
  })
}
