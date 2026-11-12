"use client"

import { BanIcon, CircleCheckIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { getFullName } from "@/features/auth/types"
import { getErrorMessage } from "@/lib/form-errors"
import { useUpdateUserStatus } from "../hooks/use-update-user-status"
import type { User } from "../types"

type ToggleUserStatusDialogProps = {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export const ToggleUserStatusDialog = ({
  open,
  user,
  onOpenChange,
}: ToggleUserStatusDialogProps) => {
  const updateStatus = useUpdateUserStatus()

  if (!user) {
    return null
  }

  const isDeactivating = user.isActive
  const fullName = getFullName(user)

  const handleConfirm = async () => {
    try {
      await updateStatus.mutateAsync({
        userId: user.id,
        isActive: !user.isActive,
      })
      toast.add({
        title: isDeactivating ? "Usuario desactivado" : "Usuario activado",
        description: isDeactivating
          ? `${fullName} quedó inactivo.`
          : `${fullName} quedó activo.`,
        type: "success",
      })
      onOpenChange(false)
    } catch (error) {
      toast.add({
        title: "No se pudo actualizar el estado",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isDeactivating ? "Desactivar usuario" : "Activar usuario"}
      icon={
        isDeactivating ? (
          <BanIcon className="size-6" />
        ) : (
          <CircleCheckIcon className="size-6" />
        )
      }
      tone={isDeactivating ? "destructive" : "success"}
      confirmText={isDeactivating ? "Desactivar usuario" : "Activar usuario"}
      confirmLoadingText={isDeactivating ? "Desactivando..." : "Activando..."}
      confirmIcon={isDeactivating ? <BanIcon /> : <CircleCheckIcon />}
      confirmVariant={isDeactivating ? "destructive" : "default"}
      isLoading={updateStatus.isPending}
      onConfirm={handleConfirm}
      description={
        isDeactivating ? (
          <>
            ¿Estás seguro de que deseas desactivar a{" "}
            <span className="text-foreground font-semibold">{fullName}</span> (
            <span className="text-foreground font-medium">{user.email}</span>)?
            El usuario no podrá iniciar sesión en la plataforma mientras permanezca inactivo.
          </>
        ) : (
          <>
            ¿Deseas activar la cuenta de{" "}
            <span className="text-foreground font-semibold">{fullName}</span> (
            <span className="text-foreground font-medium">{user.email}</span>)?
            El usuario podrá volver a ingresar y operar en el sistema.
          </>
        )
      }
    />
  )
}
