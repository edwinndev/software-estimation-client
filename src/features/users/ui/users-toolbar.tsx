"use client"

import { FilterIcon, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UsersToolbarProps = {
  search: string
  activeFilters: number
  onSearchChange: (search: string) => void
  onOpenFilters: () => void
}

export const UsersToolbar = ({
  search,
  activeFilters,
  onSearchChange,
  onOpenFilters,
}: UsersToolbarProps) => {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={search}
          placeholder="Buscar por nombre o correo"
          className="w-full pl-8"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        className="shrink-0"
        onClick={onOpenFilters}
      >
        <FilterIcon />
        Filtros
        {activeFilters > 0 ? (
          <Badge variant="secondary" size="sm">
            {activeFilters}
          </Badge>
        ) : null}
      </Button>
    </div>
  )
}
