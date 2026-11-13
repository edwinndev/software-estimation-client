"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PROFILES_QUERY_KEY } from "@/features/profiles/hooks/use-profiles"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { storiesService } from "../services/stories-service"
import type { StoryFormValues, TaskFormValues } from "../schemas/story-schema"
import type { MoveDirection, UserStory } from "../types/story-types"

type BacklogFilters = {
  search?: string
  priority?: UserStory["priority"] | ""
  status?: UserStory["status"] | ""
}

export const useStories = (projectId: string, filters: BacklogFilters = {}) => {
  const queryClient = useQueryClient()
  const queryKey = ["backlog", projectId]
  const refresh = async () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey }),
      queryClient.invalidateQueries({ queryKey: ["user-stories", projectId] }),
      queryClient.invalidateQueries({
        queryKey: ["sprint-calculation", projectId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["task-hours", projectId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["project-costs", projectId],
      }),
      invalidateReportQueries(queryClient),
    ])
  const backlog = useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => storiesService.getStories(projectId, filters),
  })
  const profiles = useQuery({
    queryKey: [...PROFILES_QUERY_KEY, "assignable"],
    queryFn: storiesService.getProfiles,
  })
  const useMutationAction = <TVariables>(
    mutationFn: (variables: TVariables) => Promise<unknown>
  ) => useMutation({ mutationFn, onSettled: refresh })

  return {
    ...backlog,
    profiles: profiles.data ?? [],
    createStory: useMutationAction((values: StoryFormValues) =>
      storiesService.createStory(projectId, values)
    ),
    updateStory: useMutationAction(
      ({ id, values }: { id: string; values: StoryFormValues }) =>
        storiesService.updateStory(projectId, id, values)
    ),
    deleteStory: useMutationAction((id: string) =>
      storiesService.deleteStory(projectId, id)
    ),
    createTask: useMutationAction(
      ({ storyId, values }: { storyId: string; values: TaskFormValues }) =>
        storiesService.createTask(projectId, storyId, values)
    ),
    updateTask: useMutationAction(
      ({ id, values }: { id: string; values: TaskFormValues }) =>
        storiesService.updateTask(projectId, id, values)
    ),
    deleteTask: useMutationAction((id: string) =>
      storiesService.deleteTask(projectId, id)
    ),
    moveStory: useMutationAction(
      ({ id, direction }: { id: string; direction: MoveDirection }) =>
        storiesService.moveStory(projectId, id, direction)
    ),
    moveTask: useMutationAction(
      ({ id, direction }: { id: string; direction: MoveDirection }) =>
        storiesService.moveTask(projectId, id, direction)
    ),
  }
}
