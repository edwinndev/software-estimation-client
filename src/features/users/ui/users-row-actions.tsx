"use client"

import Link from "next/link"
import {
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PowerIcon,
  TrashIcon,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePermissions } from "@/features/auth/hooks/use-permissions"
import { useSession } from "@/features/auth/hooks/use-session"
import type { User } from "../types"

type UsersRowActionsProps = {
  user: User
  onEdit?: (user: User) => void
  onToggleStatus?: (user: User) => void
  onResendInvitation?: (user: User) => void
  onDelete: (user: User) => void
}

export const UsersRowActions = ({
  user,
  onEdit,
  onToggleStatus,
  onResendInvitation,
  onDelete,
}: UsersRowActionsProps) => {
  const { data: session } = useSession()
  const { canWriteUsers, canDeleteUsers } = usePermissions()
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
              onEdit ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(user)}
                >
                  <PencilIcon />
                  <span className="sr-only">Editar usuario</span>
                </Button>
              ) : (
                <Link
                  href={`/users/${user.id}/edit`}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-sm",
                  })}
                />
              )
            }
          >
            {onEdit ? null : <PencilIcon />}
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
              disabled={isCurrentUser}
              onClick={() => {
                if (onToggleStatus) {
                  onToggleStatus(user)
                }
              }}
            >
              <PowerIcon />
              {user.isActive ? "Desactivar usuario" : "Activar usuario"}
            </DropdownMenuItem>
          ) : null}
          {canWriteUsers ? (
            <DropdownMenuItem
              disabled={!user.isActive}
              onClick={() => {
                if (onResendInvitation) {
                  onResendInvitation(user)
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
