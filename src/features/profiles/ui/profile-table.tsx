"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DollarSignIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import type { Profile } from "../types"

type ProfileTableProps = {
  profiles: Profile[]
  onEdit: (profile: Profile) => void
  onAssignCer: (profile: Profile) => void
  onDelete: (profile: Profile) => void
}

const getSeniorityBadgeVariant = (level: Profile["experienceLevel"]) => {
  switch (level) {
    case "Senior":
    case "Lead":
      return "default"
    case "Mid":
      return "secondary"
    case "Junior":
    default:
      return "outline"
  }
}

export const ProfileTable = ({
  profiles,
  onEdit,
  onAssignCer,
  onDelete,
}: ProfileTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Perfil / Integrante</TableHead>
            <TableHead>Rol técnico</TableHead>
            <TableHead>Seniority</TableHead>
            <TableHead>CER horario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[70px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {profile.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{profile.role}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getSeniorityBadgeVariant(profile.experienceLevel)}
                >
                  {profile.experienceLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onAssignCer(profile)}
                  className="hover:bg-muted/80 inline-flex items-center rounded-md px-2 py-1 text-left transition-colors"
                  title="Haz clic para asignar o modificar CER"
                >
                  <div className="text-sm font-semibold">
                    {profile.currency} {profile.hourlyRate.toFixed(2)}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      / hora
                    </span>
                  </div>
                </button>
              </TableCell>
              <TableCell>
                <Badge variant={profile.isActive ? "secondary" : "outline"}>
                  {profile.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md text-sm font-medium">
                    <MoreHorizontalIcon className="size-4" />
                    <span className="sr-only">Abrir acciones</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAssignCer(profile)}>
                      <DollarSignIcon className="mr-2 size-4" />
                      Asignar CER horario
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(profile)}>
                      <PencilIcon className="mr-2 size-4" />
                      Editar perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(profile)}
                      variant="destructive"
                    >
                      <Trash2Icon className="mr-2 size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
