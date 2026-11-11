"use client"

import { MailIcon, SendIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { getFullName } from "@/features/auth/types"
import { getErrorMessage } from "@/lib/form-errors"
import { useResendInvitation } from "../hooks/use-resend-invitation"
import type { User } from "../types"

type ResendInvitationDialogProps = {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export const ResendInvitationDialog = ({
  open,
  user,
  onOpenChange,
}: ResendInvitationDialogProps) => {
  const resendInvitation = useResendInvitation()

  if (!user) {
    return null
  }

  const fullName = getFullName(user)

  const handleConfirm = async () => {
    try {
      await resendInvitation.mutateAsync(user.id)
      toast.add({
        title: "Invitación reenviada",
        description: `Se envió un nuevo correo con código de activación a ${user.email}.`,
        type: "success",
      })
      onOpenChange(false)
    } catch (error) {
      toast.add({
        title: "No se pudo reenviar la invitación",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reenviar invitación"
      icon={<MailIcon className="size-6" />}
      tone="info"
      confirmText="Reenviar correo"
      confirmLoadingText="Reenviando..."
      confirmIcon={<SendIcon />}
      confirmVariant="default"
      isLoading={resendInvitation.isPending}
      onConfirm={handleConfirm}
      description={
        <>
          ¿Deseas reenviar el correo de invitación con un nuevo código de acceso a{" "}
          <span className="text-foreground font-semibold">{fullName}</span> (
          <span className="text-foreground font-medium">{user.email}</span>)?
        </>
      }
    />
  )
}
