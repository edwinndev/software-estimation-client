"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  userStoriesService,
  UserStoryItem,
} from "../services/user-stories.service"
import { StoryPoints } from "../types"

const USER_STORIES_KEY = ["user-stories"] as const
const ASSIGNMENTS_KEY = ["story-points-assignments"] as const

export const useUserStories = (projectId: string = "1") => {
  return useQuery<UserStoryItem[]>({
    queryKey: [...USER_STORIES_KEY, projectId],
    queryFn: () => userStoriesService.getUserStories(projectId),
  })
}

export const useStoryPointsAssignments = () => {
  return useQuery<Record<string, StoryPoints>>({
    queryKey: ASSIGNMENTS_KEY,
    queryFn: () => userStoriesService.getAssignments(),
  })
}

export const useAssignStoryPoints = () => {
  const queryClient = useQueryClient()

  // Recibe { storyId, points } exactamente como lo llama tu formulario
  return useMutation({
    mutationFn: ({ storyId, points }: { storyId: string; points: number }) =>
      userStoriesService.assignStoryPoints(storyId, points as StoryPoints),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: USER_STORIES_KEY })
    },
  })
}
