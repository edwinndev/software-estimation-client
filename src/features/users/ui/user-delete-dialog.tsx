"use client"

import { TrashIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { getFullName } from "@/features/auth/types"
import { getErrorMessage } from "@/lib/form-errors"
import { useDeleteUser } from "../hooks/use-delete-user"
import type { User } from "../types"

type UserDeleteDialogProps = {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export const UserDeleteDialog = ({
  open,
  user,
  onOpenChange,
}: UserDeleteDialogProps) => {
  const deleteUser = useDeleteUser()

  if (!user) {
    return null
  }

  const fullName = getFullName(user)

  const handleConfirm = async () => {
    try {
      await deleteUser.mutateAsync(user.id)
      toast.add({
        title: "Usuario eliminado",
        description: `${fullName} se eliminó correctamente.`,
        type: "success",
      })
      onOpenChange(false)
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar el usuario",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar usuario"
      icon={<TrashIcon className="size-6" />}
      tone="destructive"
      confirmText="Eliminar usuario"
      confirmLoadingText="Eliminando..."
      confirmIcon={<TrashIcon />}
      confirmVariant="destructive"
      isLoading={deleteUser.isPending}
      onConfirm={handleConfirm}
      description={
        <>
          ¿Seguro que quieres eliminar a{" "}
          <span className="text-foreground font-semibold">{fullName}</span> (
          <span className="text-foreground font-medium">{user.email}</span>)?
          Esta persona ya no podrá iniciar sesión y sus datos quedarán archivados.
        </>
      }
    />
  )
}
