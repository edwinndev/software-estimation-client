"use client"

import { TrashIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { useProjects } from "../hooks/use-projects"

type ProjectDeleteDialogProps = {
  projectId: string | null
  projectName: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
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
      toast.add({
        title: "Proyecto eliminado",
        description: `${projectName} se eliminó correctamente.`,
        type: "success",
      })
      onClose()
      onSuccess()
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar el proyecto",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <ConfirmDialog
      open={isOpen && Boolean(projectId)}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      title="Eliminar proyecto"
      icon={<TrashIcon className="size-6" />}
      tone="destructive"
      confirmText="Eliminar proyecto"
      confirmLoadingText="Eliminando..."
      confirmIcon={<TrashIcon />}
      confirmVariant="destructive"
      isLoading={isDeleting}
      onConfirm={handleConfirm}
      description={
        <>
          ¿Seguro que quieres eliminar el proyecto{" "}
          <span className="text-foreground font-semibold">{projectName}</span>
          ? Esta acción no se puede deshacer.
        </>
      }
    />
  )
}
