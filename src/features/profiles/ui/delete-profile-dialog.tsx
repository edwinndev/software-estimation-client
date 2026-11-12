"use client"

import { TrashIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
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

  if (!profile) {
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

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar perfil técnico"
      icon={<TrashIcon className="size-6" />}
      tone="destructive"
      confirmText="Eliminar perfil"
      confirmLoadingText="Eliminando..."
      confirmIcon={<TrashIcon />}
      confirmVariant="destructive"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
      description={
        <>
          ¿Seguro que quieres eliminar el perfil{" "}
          <span className="text-foreground font-semibold">{profile.name}</span>{" "}
          ({profile.role})? Esta acción no se puede deshacer.
        </>
      }
    />
  )
}
