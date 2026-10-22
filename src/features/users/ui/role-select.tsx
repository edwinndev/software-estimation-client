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
  type RoleResponse,
} from "@/features/auth/types"
import { ALL_ROLES_VALUE } from "../schemas/user-filters-schema"

type RoleSelectProps = {
  id: string
  value: string
  includeAll?: boolean
  /** When set, options come from the API (value = role id). */
  roles?: RoleResponse[]
  /** Hide system roles (e.g. admin) when assigning roles to users. */
  excludeSystem?: boolean
  onValueChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
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
  roles,
  excludeSystem = false,
  onValueChange,
  disabled = false,
  placeholder = "Selecciona un rol",
}: RoleSelectProps) => {
  const apiOptions = (roles ?? [])
    .filter((role) => (excludeSystem ? !role.isSystem : true))
    .map((role) => ({
      value: role.id,
      label: role.name,
      code: role.code,
    }))

  const staticOptions = ROLE_OPTIONS.map((role) => ({
    value: role.value,
    label: role.label,
    code: role.value,
  }))

  const options = roles ? apiOptions : staticOptions

  const selected = options.find((option) => option.value === value)
  const selectedStatic = isUserRole(value) ? ROLE_BY_VALUE[value] : null
  const selectedLabel =
    selected?.label ??
    selectedStatic?.label ??
    (includeAll && value === ALL_ROLES_VALUE ? "TODOS" : placeholder)

  const items = [
    ...(includeAll
      ? [{ value: ALL_ROLES_VALUE, label: roleOptionLabel("TODOS") }]
      : []),
    ...options.map((role) => ({
      value: role.value,
      label: roleOptionLabel(role.label),
    })),
  ]

  return (
    <Select
      value={value}
      items={items}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue)
        }
      }}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue>{roleOptionLabel(selectedLabel)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {includeAll ? (
          <SelectItem value={ALL_ROLES_VALUE}>
            {roleOptionLabel("TODOS")}
          </SelectItem>
        ) : null}
        {options.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {roleOptionLabel(role.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
