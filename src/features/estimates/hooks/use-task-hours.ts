"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { taskHoursService } from "../services/task-hours.service"
import type { UpdateTaskHoursInput } from "../types"

export const TASK_HOURS_QUERY_KEY = ["task-hours"]

export const useTaskHours = (projectId: string) => {
  return useQuery({
    queryKey: [...TASK_HOURS_QUERY_KEY, projectId],
    queryFn: () => taskHoursService.getTaskHourEntries(projectId),
  })
}

export const useUpdateTaskHours = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateTaskHoursInput) =>
      taskHoursService.updateTaskHours(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...TASK_HOURS_QUERY_KEY, projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["sprint-calculation", projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["project-costs", projectId],
      })
      invalidateReportQueries(queryClient)
    },
  })
}
