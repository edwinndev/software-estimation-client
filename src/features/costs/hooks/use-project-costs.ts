"use client"

import { useQuery } from "@tanstack/react-query"
import { costsService } from "../services/costs-service"

export const PROJECT_COSTS_QUERY_KEY = ["project-costs"]

export const useProjectCosts = (projectId: string) => {
  return useQuery({
    queryKey: [...PROJECT_COSTS_QUERY_KEY, projectId],
    queryFn: () => costsService.getProjectCostSummary(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}
