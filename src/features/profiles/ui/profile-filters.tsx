"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import { TechnicalRoleSelect } from "./technical-role-select"

type ProfileFiltersProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedRole: string
  onRoleChange: (value: string) => void
  onOpenCreateDialog: () => void
}

export const ProfileFilters = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  onOpenCreateDialog,
}: ProfileFiltersProps) => {
  const hasFilters = Boolean(
    searchQuery ||
    (selectedRole && selectedRole !== "ALL" && selectedRole !== "")
  )

  const handleClear = () => {
    onSearchChange("")
    onRoleChange("")
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
          <Input
            placeholder="Buscar por nombre, rol o correo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[220px]">
          <TechnicalRoleSelect
            value={selectedRole === "ALL" ? "" : selectedRole}
            includeAll
            placeholder="Todos los roles"
            onValueChange={onRoleChange}
          />
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-9 px-2 text-xs"
          >
            <XIcon className="mr-1 size-3" />
            Limpiar filtros
          </Button>
        )}
      </div>
      <Button onClick={onOpenCreateDialog} className="shrink-0">
        <PlusIcon className="mr-2 size-4" />
        Nuevo perfil
      </Button>
    </div>
  )
}
