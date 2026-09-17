"use client"

import { useQuery } from "@tanstack/react-query"
import { calculateSprintsAndProjectTime } from "../services/sprint-calculation.service"

export const useSprintCalculation = (projectId?: string) => {
  // Query de TanStack Query para calcular sprints y tiempo
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["sprint-calculation", projectId || "1"],
    queryFn: () => calculateSprintsAndProjectTime(projectId || "1"),
  })

  return {
    calculation: data || {
      totalStoryPoints: 0,
      velocity: 5,
      sprintDuration: 2,
      sprintUnit: "dias" as const,
      totalSprints: 0,
      totalBaseTime: 0,
    },
    isLoading,
    isRecalculating: isRefetching,
    recalculate: refetch, // Función para el botón "Recalcular Tiempo"
  }
}
