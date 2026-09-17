"use client"

import { useQuery } from "@tanstack/react-query"
import { calculateSprintsAndProjectTime } from "../services/sprint-calculation.service"
import type { SprintCalculationResult } from "../types"

const EMPTY_CALCULATION: SprintCalculationResult = {
  totalStoryPoints: 0,
  storiesTotal: 0,
  storiesWithPoints: 0,
  velocity: 5,
  sprintDuration: 2,
  sprintUnit: "dias",
  totalSprints: 0,
  totalBaseTime: 0,
  totalEffortHours: 0,
  tasksTotal: 0,
  tasksWithHours: 0,
}

export const useSprintCalculation = (projectId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sprint-calculation", projectId],
    queryFn: () => calculateSprintsAndProjectTime(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })

  return {
    calculation: data ?? EMPTY_CALCULATION,
    isLoading,
  }
}
