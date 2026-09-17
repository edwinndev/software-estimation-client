"use client"

import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type TaskProfileInfoProps = {
  name: string
  roleLabel: string
  email: string
  hourlyRate: number
  icon: LucideIcon
  color: string
}

export const TaskProfileInfo = ({
  name,
  roleLabel,
  email,
  hourlyRate,
  icon: Icon,
  color,
}: TaskProfileInfoProps) => {
  return (
    <span className="flex min-w-0 items-start gap-2">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">
          {roleLabel}
        </span>
        <span className="text-muted-foreground text-xs break-all">{email}</span>
        <span className="text-xs font-medium tabular-nums">
          CER {formatCurrency(hourlyRate)}/h
        </span>
      </span>
    </span>
  )
}
