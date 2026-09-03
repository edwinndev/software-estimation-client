"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getTechnicalProfiles,
  getTaskHoursEntries,
  saveTaskHourEntry,
} from "../services/task-hours.service"
import { TaskHourEntry } from "../types"

export const useTaskHours = () => {
  const queryClient = useQueryClient()

  // 1. Cargar perfiles técnicos
  const profilesQuery = useQuery({
    queryKey: ["technical-profiles"],
    queryFn: getTechnicalProfiles,
  })

  // 2. Cargar horas de tareas de localStorage ("task-hours-entries")
  const taskHoursQuery = useQuery({
    queryKey: ["task-hours-entries"],
    queryFn: getTaskHoursEntries,
  })

  // 3. Mutación para PMGT-32: Guardar nueva asignación de horas
  const saveTaskHourMutation = useMutation({
    mutationFn: (entry: Omit<TaskHourEntry, "id" | "updatedAt">) =>
      saveTaskHourEntry(entry),
    onSuccess: () => {
      // Invalida la caché para que la lista y la pantalla se actualicen al instante
      queryClient.invalidateQueries({ queryKey: ["task-hours-entries"] })
    },
  })

  return {
    profiles: profilesQuery.data || [],
    isLoadingProfiles: profilesQuery.isLoading,
    taskHours: taskHoursQuery.data || [],
    isLoadingTaskHours: taskHoursQuery.isLoading,
    saveTaskHour: saveTaskHourMutation.mutate,
    isSavingTaskHour: saveTaskHourMutation.isPending,
  }
}
