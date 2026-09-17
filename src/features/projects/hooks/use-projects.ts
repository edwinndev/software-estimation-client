import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { ProjectFormValues } from "../schemas/project-schema"
import { QueryRequest } from "@/types/api"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
  })
}

export const useProjects = (query?: QueryRequest) => {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ["projects", query],
    queryFn: () =>
      query
        ? projectService.searchProjects(query)
        : Promise.resolve({
            projectResponse: [],
            pageSize: 20,
            pageNumber: 0,
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false,
          }),
    enabled: !!query,
  })

  const allProjectsQuery = useQuery({
    queryKey: ["projects", "all"],
    queryFn: projectService.getProjects,
  })

  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectFormValues) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: ProjectFormValues & { estado: string }
    }) => projectService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
    },
  })

  const updateProjectStatusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      projectService.updateProjectStatus(id, estado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      invalidateReportQueries(queryClient)
    },
  })

  return {
    paginatedProjects: projectsQuery.data,
    projects: allProjectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading || allProjectsQuery.isLoading,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    updateProjectStatus: updateProjectStatusMutation.mutateAsync,
    isUpdatingStatus: updateProjectStatusMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
  }
}
