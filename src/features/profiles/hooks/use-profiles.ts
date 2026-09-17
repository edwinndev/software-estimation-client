import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { QueryRequest } from "@/types/api"
import { profilesService } from "../services/profiles-service"
import type { CreateProfilePayload, UpdateProfilePayload } from "../types"

export const PROFILES_QUERY_KEY = ["profiles"]

export const useProfiles = (query?: QueryRequest) => {
  return useQuery({
    queryKey: [...PROFILES_QUERY_KEY, query],
    queryFn: () => profilesService.getProfiles(query),
  })
}

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: [...PROFILES_QUERY_KEY, id],
    queryFn: () => profilesService.getProfile(id),
    enabled: Boolean(id),
  })
}

export const useCreateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProfilePayload) =>
      profilesService.createProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profilesService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
    },
  })
}

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => profilesService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
    },
  })
}
