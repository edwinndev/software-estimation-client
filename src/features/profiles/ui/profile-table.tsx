"use client"

import { BanIcon, CircleCheckIcon } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Profile } from "../types"
import { ProfileRowActions } from "./profile-row-actions"

type ProfileTableProps = {
  profiles: Profile[]
  onEdit: (profile: Profile) => void
  onAssignCer: (profile: Profile) => void
  onDelete: (profile: Profile) => void
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
            <TableHead className="w-28 text-right">Acciones</TableHead>
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
                <span className="text-sm">{profile.experienceLevel}</span>
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onAssignCer(profile)}
                  className="hover:bg-muted/80 inline-flex items-center rounded-md px-2 py-1 text-left transition-colors"
                >
                  <div className="text-sm font-semibold">
                    {formatCurrency(profile.hourlyRate)}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      / hora
                    </span>
                  </div>
                </button>
              </TableCell>
              <TableCell>
                <StatusBadge
                  tone={profile.isActive ? "success" : "neutral"}
                  label={profile.isActive ? "Activo" : "Inactivo"}
                  icon={profile.isActive ? CircleCheckIcon : BanIcon}
                />
              </TableCell>
              <TableCell>
                <ProfileRowActions
                  profile={profile}
                  onEdit={onEdit}
                  onAssignCer={onAssignCer}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
