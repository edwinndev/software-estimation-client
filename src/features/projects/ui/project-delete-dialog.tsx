"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { TrashIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

  useEffect(() => {
    if (!isOpen) {
      return
    }

    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.removeProperty("overflow")
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isDeleting, isOpen, onClose])

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

  if (!isOpen || !projectId) {
    return null
  }

  const canInteract = !isDeleting

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (canInteract) {
            onClose()
          }
        }}
      />
      <Card className="relative z-10 w-full max-w-sm shadow-lg">
        <CardHeader className="justify-items-center text-center">
          <div className="bg-destructive/10 text-destructive mx-auto flex size-14 items-center justify-center rounded-full">
            <TrashIcon className="size-7" />
          </div>
          <CardTitle>Eliminar proyecto</CardTitle>
          <CardDescription>
            ¿Seguro que quieres eliminar el proyecto{" "}
            <span className="text-foreground font-semibold">{projectName}</span>
            ? Esta acción no se puede deshacer.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!canInteract}
            onClick={onClose}
          >
            <XIcon />
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canInteract}
            onClick={handleConfirm}
          >
            <TrashIcon />
            {isDeleting ? "Eliminando..." : "Eliminar proyecto"}
          </Button>
        </CardFooter>
      </Card>
    </div>,
    document.body
  )
}
