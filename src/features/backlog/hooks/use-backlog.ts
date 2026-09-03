"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { backlogService } from "../services/backlog-service"
import type { BacklogTask, UserStory } from "../types/backlog-types"

export const useBacklog = (projectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ["backlog", projectId]
  const refresh = () => queryClient.invalidateQueries({ queryKey })
  const backlog = useQuery({
    queryKey,
    queryFn: () => backlogService.getBacklog(projectId),
  })
  const profiles = useQuery({
    queryKey: ["technical-profiles"],
    queryFn: backlogService.getProfiles,
  })
  const useMutationAction = <TVariables>(
    mutationFn: (variables: TVariables) => Promise<unknown>
  ) => useMutation({ mutationFn, onSuccess: refresh })

  return {
    ...backlog,
    profiles: profiles.data ?? [],
    createStory: useMutationAction(
      (
        values: Omit<UserStory, "id" | "projectId" | "createdAt" | "updatedAt">
      ) => backlogService.createStory(projectId, values)
    ),
    updateStory: useMutationAction(
      ({ id, values }: { id: string; values: Partial<UserStory> }) =>
        backlogService.updateStory(projectId, id, values)
    ),
    deleteStory: useMutationAction((id: string) =>
      backlogService.deleteStory(projectId, id)
    ),
    createTask: useMutationAction(
      ({
        storyId,
        values,
      }: {
        storyId: string
        values: Omit<BacklogTask, "id" | "storyId" | "createdAt" | "updatedAt">
      }) => backlogService.createTask(projectId, storyId, values)
    ),
    updateTask: useMutationAction(
      ({ id, values }: { id: string; values: Partial<BacklogTask> }) =>
        backlogService.updateTask(projectId, id, values)
    ),
    deleteTask: useMutationAction((id: string) =>
      backlogService.deleteTask(projectId, id)
    ),
  }
}
