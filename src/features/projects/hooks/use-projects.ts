import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { ProjectFormValues } from "../schemas/project-schema"
import { QueryRequest } from "@/types/api"
import { toast } from "@/components/ui/toast"

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
      toast.add({ title: "Proyecto creado exitosamente", type: "success" })
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
      toast.add({ title: "Proyecto actualizado exitosamente", type: "success" })
    },
    onError: () => {
      toast.add({ title: "Error al actualizar el proyecto", type: "error" })
    },
  })

  const updateProjectStatusMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      projectService.updateProjectStatus(id, estado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
      toast.add({ title: "Estado del proyecto actualizado", type: "success" })
    },
    onError: () => {
      toast.add({
        title: "Error al actualizar el estado del proyecto",
        type: "error",
      })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast.add({ title: "Proyecto eliminado exitosamente", type: "success" })
    },
    onError: () => {
      toast.add({ title: "Error al eliminar el proyecto", type: "error" })
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
