"use client"

import {
  DollarSignIcon,
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
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getErrorMessage } from "@/lib/form-errors"
import { useUpdateProfileStatus } from "../hooks"
import type { Profile } from "../types"

type ProfileRowActionsProps = {
  profile: Profile
  onEdit: (profile: Profile) => void
  onAssignCer: (profile: Profile) => void
  onDelete: (profile: Profile) => void
}

export const ProfileRowActions = ({
  profile,
  onEdit,
  onAssignCer,
  onDelete,
}: ProfileRowActionsProps) => {
  const updateStatus = useUpdateProfileStatus()

  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(profile)}
            />
          }
        >
          <PencilIcon />
          <span className="sr-only">Editar perfil</span>
        </TooltipTrigger>
        <TooltipContent>Editar perfil</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          aria-label="Más acciones"
        >
          <MoreHorizontalIcon />
          <span className="sr-only">Más acciones</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem onClick={() => onAssignCer(profile)}>
            <DollarSignIcon />
            Asignar CER horario
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={updateStatus.isPending}
            onClick={async () => {
              try {
                await updateStatus.mutateAsync({
                  id: profile.id,
                  isActive: !profile.isActive,
                })
                toast.add({
                  title: profile.isActive
                    ? "Perfil desactivado"
                    : "Perfil activado",
                  description: profile.isActive
                    ? `${profile.name} quedó inactivo.`
                    : `${profile.name} quedó activo.`,
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
            {profile.isActive ? "Desactivar perfil" : "Activar perfil"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(profile)}
          >
            <TrashIcon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
