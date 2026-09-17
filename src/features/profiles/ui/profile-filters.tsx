"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon } from "lucide-react"
import { TechnicalRoleSelect } from "./technical-role-select"

type ProfileFiltersProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedRole: string
  onRoleChange: (value: string) => void
}

export const ProfileFilters = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
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
    <div className="flex w-full items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nombre, rol o correo..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-8"
        />
      </div>
      <div className="w-[220px] shrink-0">
        <TechnicalRoleSelect
          id="profile-role-filter"
          value={selectedRole === "ALL" ? "" : selectedRole}
          includeAll
          onValueChange={onRoleChange}
        />
      </div>
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="shrink-0"
        >
          <XIcon />
          Limpiar
        </Button>
      ) : null}
    </div>
  )
}
