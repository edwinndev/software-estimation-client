"use client"

import { Layers, type LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { TECHNICAL_ROLE_OPTIONS } from "../types"

type TechnicalRoleSelectProps = {
  id: string
  value: string
  includeAll: boolean
  onValueChange: (value: string) => void
}

const AllRolesIcon = Layers
const ALL_ROLES_COLOR = "text-muted-foreground"

const roleOptionLabel = (label: string, Icon: LucideIcon, color: string) => {
  return (
    <span className="flex items-center gap-2">
      <Icon className={cn("size-4 shrink-0", color)} />
      {label}
    </span>
  )
}

export const TechnicalRoleSelect = ({
  id,
  value,
  includeAll,
  onValueChange,
}: TechnicalRoleSelectProps) => {
  const selectedOption = TECHNICAL_ROLE_OPTIONS.find(
    (opt) => opt.value === value
  )

  const items = [
    ...(includeAll
      ? [
          {
            value: "",
            label: roleOptionLabel(
              "Todos los roles",
              AllRolesIcon,
              ALL_ROLES_COLOR
            ),
          },
        ]
      : []),
    ...TECHNICAL_ROLE_OPTIONS.map((opt) => ({
      value: opt.value,
      label: roleOptionLabel(opt.label, opt.icon, opt.color),
    })),
  ]

  const displayLabel = selectedOption
    ? roleOptionLabel(
        selectedOption.label,
        selectedOption.icon,
        selectedOption.color
      )
    : includeAll
      ? roleOptionLabel("Todos los roles", AllRolesIcon, ALL_ROLES_COLOR)
      : roleOptionLabel(
          "Selecciona un rol técnico",
          AllRolesIcon,
          ALL_ROLES_COLOR
        )

  return (
    <Select
      value={value === "ALL" ? "" : value}
      items={items}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue)
        }
      }}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Todos los roles">{displayLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {includeAll ? (
          <SelectItem value="">
            {roleOptionLabel("Todos los roles", AllRolesIcon, ALL_ROLES_COLOR)}
          </SelectItem>
        ) : null}
        {TECHNICAL_ROLE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {roleOptionLabel(opt.label, opt.icon, opt.color)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
