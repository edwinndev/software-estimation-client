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
import { useDeleteProfile } from "../hooks"
import type { Profile } from "../types"

type DeleteProfileDialogProps = {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const DeleteProfileDialog = ({
  profile,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProfileDialogProps) => {
  const deleteMutation = useDeleteProfile()
  const isDeleting = deleteMutation.isPending

  useEffect(() => {
    if (!open) {
      return
    }

    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.removeProperty("overflow")
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isDeleting, open, onOpenChange])

  if (!open || !profile) {
    return null
  }

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(profile.id)
      toast.add({
        title: "Perfil eliminado",
        description: `${profile.name} se eliminó correctamente.`,
        type: "success",
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar el perfil",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const canInteract = !isDeleting

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (canInteract) {
            onOpenChange(false)
          }
        }}
      />
      <Card className="relative z-10 w-full max-w-sm shadow-lg">
        <CardHeader className="justify-items-center text-center">
          <div className="bg-destructive/10 text-destructive mx-auto flex size-14 items-center justify-center rounded-full">
            <TrashIcon className="size-7" />
          </div>
          <CardTitle>Eliminar perfil técnico</CardTitle>
          <CardDescription>
            ¿Seguro que quieres eliminar el perfil{" "}
            <span className="text-foreground font-semibold">
              {profile.name}
            </span>{" "}
            ({profile.role})? Esta acción no se puede deshacer.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!canInteract}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="mr-1 size-4" />
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canInteract}
            onClick={handleConfirm}
          >
            <TrashIcon className="mr-1 size-4" />
            {isDeleting ? "Eliminando..." : "Eliminar perfil"}
          </Button>
        </CardFooter>
      </Card>
    </div>,
    document.body
  )
}
