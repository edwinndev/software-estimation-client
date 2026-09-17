import type { QueryClient } from "@tanstack/react-query"

export const REPORTS_QUERY_KEY = ["reports"] as const
export const GLOBAL_REPORTS_QUERY_KEY = ["global-reports"] as const

export const invalidateReportQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [...REPORTS_QUERY_KEY] })
  queryClient.invalidateQueries({ queryKey: [...GLOBAL_REPORTS_QUERY_KEY] })
}
