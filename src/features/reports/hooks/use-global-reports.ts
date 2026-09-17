import { useQuery } from "@tanstack/react-query"
import { globalReportsService } from "../services/global-reports.service"

export const GLOBAL_REPORTS_KEYS = {
  all: ["global-reports"] as const,
  system: () => [...GLOBAL_REPORTS_KEYS.all, "system"] as const,
}

export const useGlobalSystemReports = () => {
  return useQuery({
    queryKey: GLOBAL_REPORTS_KEYS.system(),
    queryFn: () => globalReportsService.getGlobalSystemReport(),
  })
}

export const useGlobalReportsHistory = () => {
  return useQuery({
    queryKey: [...GLOBAL_REPORTS_KEYS.all, "history"],
    queryFn: () => globalReportsService.getGlobalHistory(),
  })
}
