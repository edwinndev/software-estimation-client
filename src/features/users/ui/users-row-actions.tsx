"use client"

import Link from "next/link"
import {
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PowerIcon,
  TrashIcon,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePermissions } from "@/features/auth/hooks/use-permissions"
import { useSession } from "@/features/auth/hooks/use-session"
import { getErrorMessage } from "@/lib/form-errors"
import { useResendInvitation } from "../hooks/use-resend-invitation"
import { useUpdateUserStatus } from "../hooks/use-update-user-status"
import type { User } from "../types"

type UsersRowActionsProps = {
  user: User
  onDelete: (user: User) => void
}

export const UsersRowActions = ({ user, onDelete }: UsersRowActionsProps) => {
  const { data: session } = useSession()
  const { canWriteUsers, canDeleteUsers } = usePermissions()
  const updateStatus = useUpdateUserStatus()
  const resendInvitation = useResendInvitation()
  const isCurrentUser = session ? session.userId === user.id : false

  if (!canWriteUsers && !canDeleteUsers) {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {canWriteUsers ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={`/users/${user.id}/edit`}
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon-sm",
                })}
              />
            }
          >
            <PencilIcon />
            <span className="sr-only">Editar usuario</span>
          </TooltipTrigger>
          <TooltipContent>Editar usuario</TooltipContent>
        </Tooltip>
      ) : null}

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon-sm",
                })}
                aria-label="Más acciones"
              />
            }
          >
            <MoreHorizontalIcon />
            <span className="sr-only">Más acciones</span>
          </TooltipTrigger>
          <TooltipContent>Más acciones</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="min-w-48">
          {canWriteUsers ? (
            <DropdownMenuItem
              disabled={isCurrentUser || updateStatus.isPending}
              onClick={async () => {
                try {
                  await updateStatus.mutateAsync({
                    userId: user.id,
                    isActive: !user.isActive,
                  })
                  toast.add({
                    title: user.isActive
                      ? "Usuario desactivado"
                      : "Usuario activado",
                    description: user.isActive
                      ? `${user.firstName} ${user.lastName} quedó inactivo.`
                      : `${user.firstName} ${user.lastName} quedó activo.`,
                    type: "success",
                  })
                } catch (error) {
                  toast.add({
                    title: "No se pudo actualizar el estado",
                    description: getErrorMessage(error, "Inténtalo de nuevo."),
                    type: "error",
                  })
                }
              }}
            >
              <PowerIcon />
              {user.isActive ? "Desactivar usuario" : "Activar usuario"}
            </DropdownMenuItem>
          ) : null}
          {canWriteUsers ? (
            <DropdownMenuItem
              disabled={!user.isActive || resendInvitation.isPending}
              onClick={async () => {
                try {
                  await resendInvitation.mutateAsync(user.id)
                  toast.add({
                    title: "Invitación reenviada",
                    description: `Se envió un nuevo código OTP a ${user.email}.`,
                    type: "success",
                  })
                } catch (error) {
                  toast.add({
                    title: "No se pudo reenviar la invitación",
                    description: getErrorMessage(error, "Inténtalo de nuevo."),
                    type: "error",
                  })
                }
              }}
            >
              <MailIcon />
              Reenviar invitación
            </DropdownMenuItem>
          ) : null}
          {canDeleteUsers ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={isCurrentUser}
              onClick={() => onDelete(user)}
            >
              <TrashIcon />
              Eliminar
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
