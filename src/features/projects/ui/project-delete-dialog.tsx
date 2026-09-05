import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProjects } from "../hooks/use-projects"

interface ProjectDeleteDialogProps {
  projectId: string | null
  projectName?: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ProjectDeleteDialog = ({
  projectId,
  projectName,
  isOpen,
  onClose,
  onSuccess,
}: ProjectDeleteDialogProps) => {
  const { deleteProject, isDeleting } = useProjects()

  const handleConfirm = async () => {
    if (!projectId) return

    try {
      await deleteProject(projectId)
      onClose()
      onSuccess?.()
    } catch {
      // Error is handled by the hook
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar el proyecto{" "}
            {projectName ? (
              <span className="text-foreground font-semibold">
                {projectName}
              </span>
            ) : (
              ""
            )}
            . Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
