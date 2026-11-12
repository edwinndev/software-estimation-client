"use client"

import { LogOutIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useLogout } from "../hooks/use-logout"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const logout = useLogout()

  const handleConfirm = () => {
    logout.mutate()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cerrar sesión"
      icon={<LogOutIcon className="size-6" />}
      tone="destructive"
      confirmText="Cerrar sesión"
      confirmLoadingText="Cerrando sesión..."
      confirmIcon={<LogOutIcon />}
      confirmVariant="destructive"
      isLoading={logout.isPending}
      onConfirm={handleConfirm}
      description="¿Seguro que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder a la plataforma."
    />
  )
}
