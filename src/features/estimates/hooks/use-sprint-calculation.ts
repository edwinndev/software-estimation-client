"use client"

import { useQuery } from "@tanstack/react-query"
import { calculateSprintsAndProjectTime } from "../services/sprint-calculation.service"

export const useSprintCalculation = () => {
  // Query de TanStack Query para calcular automáticamente los sprints y tiempo
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["sprint-calculation"],
    queryFn: calculateSprintsAndProjectTime,
  })

  return {
    calculation: data || {
      totalStoryPoints: 40,
      velocity: 20,
      sprintDuration: 2,
      sprintUnit: "semanas" as const,
      totalSprints: 2,
      totalBaseTime: 4,
    },
    isLoading,
    isRecalculating: isRefetching,
    recalculate: refetch, // Función para el botón "Recalcular Tiempo"
  }
}
