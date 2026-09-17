"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TECHNICAL_ROLE_OPTIONS } from "../types"

type TechnicalRoleSelectProps = {
  id?: string
  value: string
  placeholder?: string
  includeAll?: boolean
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export const TechnicalRoleSelect = ({
  id,
  value,
  placeholder = "Selecciona un rol técnico",
  includeAll = false,
  onValueChange,
  disabled = false,
  className,
}: TechnicalRoleSelectProps) => {
  const selectedOption = TECHNICAL_ROLE_OPTIONS.find(
    (opt) => opt.value === value
  )

  const items = [
    ...(includeAll ? [{ value: "", label: "Todos los roles" }] : []),
    ...TECHNICAL_ROLE_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  ]

  const displayLabel = selectedOption
    ? selectedOption.label
    : includeAll && (!value || value === "ALL")
      ? "Todos los roles"
      : placeholder

  return (
    <Select
      value={value === "ALL" ? "" : value}
      items={items}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue)
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={className ?? "w-full"}>
        <SelectValue placeholder={placeholder}>{displayLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {includeAll ? <SelectItem value="">Todos los roles</SelectItem> : null}
        {TECHNICAL_ROLE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
