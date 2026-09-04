"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import { technicalRoles } from "../schemas/profile-schema"

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
    searchQuery || (selectedRole && selectedRole !== "ALL")
  )

  const handleClear = () => {
    onSearchChange("")
    onRoleChange("ALL")
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
          <Input
            placeholder="Search by name, role or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select
            value={selectedRole}
            onValueChange={(val) => {
              if (val) onRoleChange(val)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All technical roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All technical roles</SelectItem>
              {technicalRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-9 px-2 text-xs"
          >
            <XIcon className="mr-1 size-3" />
            Clear filters
          </Button>
        )}
      </div>
      <Button onClick={onOpenCreateDialog} className="shrink-0">
        <PlusIcon className="mr-2 size-4" />
        New profile
      </Button>
    </div>
  )
}
