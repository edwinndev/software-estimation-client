"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  isUserRole,
  ROLE_BY_VALUE,
  ROLE_ITEM_ICON,
  ROLE_OPTIONS,
} from "@/features/auth/types"
import { ALL_ROLES_VALUE } from "../schemas/user-filters-schema"

type RoleSelectProps = {
  id: string
  value: string
  includeAll?: boolean
  onValueChange: (value: string) => void
}

const RoleItemIcon = ROLE_ITEM_ICON

const roleOptionLabel = (label: string) => {
  return (
    <span className="flex items-center gap-2">
      <RoleItemIcon className="size-4" />
      {label}
    </span>
  )
}

export const RoleSelect = ({
  id,
  value,
  includeAll = false,
  onValueChange,
}: RoleSelectProps) => {
  const selected = isUserRole(value) ? ROLE_BY_VALUE[value] : null
  const items = [
    ...(includeAll
      ? [{ value: ALL_ROLES_VALUE, label: roleOptionLabel("TODOS") }]
      : []),
    ...ROLE_OPTIONS.map((role) => ({
      value: role.value,
      label: roleOptionLabel(role.label),
    })),
  ]

  return (
    <Select
      value={value}
      items={items}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue)
        }
      }}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue>
          {roleOptionLabel(selected ? selected.label : "TODOS")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {includeAll ? (
          <SelectItem value={ALL_ROLES_VALUE}>
            {roleOptionLabel("TODOS")}
          </SelectItem>
        ) : null}
        {ROLE_OPTIONS.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {roleOptionLabel(role.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
