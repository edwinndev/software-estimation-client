"use client"

import { BanIcon, CircleCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getFullName,
  ROLE_BY_VALUE,
  ROLE_ITEM_ICON,
} from "@/features/auth/types"
import { formatDate } from "@/lib/format"
import type { User } from "../types"
import { CopyEmailButton } from "./copy-email-button"
import { UsersRowActions } from "./users-row-actions"

type UsersTableProps = {
  users: User[]
  onDelete: (user: User) => void
}

export const UsersTable = ({ users, onDelete }: UsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado en</TableHead>
          <TableHead className="w-28 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const role = ROLE_BY_VALUE[user.role]
          const RoleIcon = ROLE_ITEM_ICON

          return (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{getFullName(user)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span>{user.email}</span>
                  <CopyEmailButton email={user.email} />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  <RoleIcon />
                  {role.label}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusBadge
                  tone={user.isActive ? "success" : "neutral"}
                  label={user.isActive ? "Activo" : "Inactivo"}
                  icon={user.isActive ? CircleCheckIcon : BanIcon}
                />
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <UsersRowActions user={user} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
