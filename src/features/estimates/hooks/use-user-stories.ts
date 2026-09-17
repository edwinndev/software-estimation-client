"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import {
  userStoriesService,
  type UserStoryItem,
} from "../services/user-stories.service"
import type { StoryPoints } from "../types"

export const useUserStories = (projectId: string) => {
  return useQuery<UserStoryItem[]>({
    queryKey: ["user-stories", projectId],
    queryFn: () => userStoriesService.getUserStories(projectId),
  })
}

export const useStoryPointsAssignments = (projectId: string) => {
  return useQuery<Record<string, StoryPoints>>({
    queryKey: ["story-points-assignments", projectId],
    queryFn: () => userStoriesService.getAssignments(projectId),
  })
}

export const useAssignStoryPoints = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      storyId,
      points,
    }: {
      storyId: string
      points: StoryPoints
    }) => userStoriesService.assignStoryPoints(projectId, storyId, points),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["story-points-assignments", projectId],
      })
      queryClient.invalidateQueries({ queryKey: ["user-stories", projectId] })
      queryClient.invalidateQueries({
        queryKey: ["sprint-calculation", projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["task-hours", projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["project-costs", projectId],
      })
      invalidateReportQueries(queryClient)
    },
  })
}
