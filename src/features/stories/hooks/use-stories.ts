"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { storiesService } from "../services/stories-service"
import type { BacklogTask, UserStory } from "../types/stories-types"

export const useStories = (projectId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ["stories", projectId]
  const refresh = () => queryClient.invalidateQueries({ queryKey })
  const stories = useQuery({
    queryKey,
    queryFn: () => storiesService.getStories(projectId),
  })
  const profiles = useQuery({
    queryKey: ["technical-profiles"],
    queryFn: storiesService.getProfiles,
  })
  const useMutationAction = <TVariables>(
    mutationFn: (variables: TVariables) => Promise<unknown>
  ) => useMutation({ mutationFn, onSuccess: refresh })

  return {
    ...stories,
    profiles: profiles.data ?? [],
    createStory: useMutationAction(
      (
        values: Omit<UserStory, "id" | "projectId" | "createdAt" | "updatedAt">
      ) => storiesService.createStory(projectId, values)
    ),
    updateStory: useMutationAction(
      ({ id, values }: { id: string; values: Partial<UserStory> }) =>
        storiesService.updateStory(projectId, id, values)
    ),
    deleteStory: useMutationAction((id: string) =>
      storiesService.deleteStory(projectId, id)
    ),
    createTask: useMutationAction(
      ({
        storyId,
        values,
      }: {
        storyId: string
        values: Omit<BacklogTask, "id" | "storyId" | "createdAt" | "updatedAt">
      }) => storiesService.createTask(projectId, storyId, values)
    ),
    updateTask: useMutationAction(
      ({ id, values }: { id: string; values: Partial<BacklogTask> }) =>
        storiesService.updateTask(projectId, id, values)
    ),
    deleteTask: useMutationAction((id: string) =>
      storiesService.deleteTask(projectId, id)
    ),
  }
}
