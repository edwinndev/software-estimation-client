"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { sprintConfigService } from "../services/sprint-config.service"
import type { SprintConfig } from "../types"

export const useSprintConfig = (projectId: string) => {
  return useQuery({
    queryKey: ["sprint-config", projectId],
    queryFn: () => sprintConfigService.get(projectId),
  })
}

export const useSaveSprintConfig = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: SprintConfig) =>
      sprintConfigService.save(projectId, config),
    onSuccess: (config) => {
      queryClient.setQueryData(["sprint-config", projectId], config)
      queryClient.invalidateQueries({
        queryKey: ["sprint-calculation", projectId],
      })
      invalidateReportQueries(queryClient)
    },
  })
}
