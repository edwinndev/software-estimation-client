"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { sprintConfigService } from "../services/sprint-config.service"
import type { SprintConfig } from "../types"

const SPRINT_CONFIG_KEY = ["sprint-config"] as const

export const useSprintConfig = () => {
  return useQuery({
    queryKey: SPRINT_CONFIG_KEY,
    queryFn: () => sprintConfigService.get(),
  })
}

export const useSaveSprintConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: SprintConfig) => sprintConfigService.save(config),
    onSuccess: (config) => {
      queryClient.setQueryData(SPRINT_CONFIG_KEY, config)
    },
  })
}
