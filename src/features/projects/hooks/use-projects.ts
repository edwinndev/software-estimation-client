import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { ProjectFormValues } from "../schemas/project-schema"

export const useProjects = () => {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  })

  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectFormValues) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
  }
}
