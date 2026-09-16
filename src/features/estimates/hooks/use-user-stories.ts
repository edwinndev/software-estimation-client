"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { userStoriesService } from "../services/user-stories.service"

const USER_STORIES_KEY = ["user-stories"] as const
const ASSIGNMENTS_KEY = ["story-points-assignments"] as const

/** Lee las historias de usuario (dato ajeno, prestado). */
export const useUserStories = () => {
  return useQuery({
    queryKey: USER_STORIES_KEY,
    queryFn: () => userStoriesService.listUserStories(),
  })
}

/** Lee el mapa de Story Points asignados (dato propio). */
export const useStoryPointsAssignments = () => {
  return useQuery({
    queryKey: ASSIGNMENTS_KEY,
    queryFn: () => userStoriesService.getAssignments(),
  })
}

/** Asigna/actualiza los Story Points de una historia. */
export const useAssignStoryPoints = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storyId, points }: { storyId: string; points: number }) =>
      userStoriesService.assignStoryPoints(storyId, points),
    onSuccess: (assignments) => {
      queryClient.setQueryData(ASSIGNMENTS_KEY, assignments)
    },
  })
}
