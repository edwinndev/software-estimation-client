import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  STATUS_TONE_BADGE_VARIANT,
  STATUS_TONE_ICON_CLASS,
  type StatusTone,
} from "@/lib/status-tone"
import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  tone: StatusTone
  label: string
  icon: LucideIcon | null
}

export const StatusBadge = ({ tone, label, icon: Icon }: StatusBadgeProps) => {
  return (
    <Badge variant={STATUS_TONE_BADGE_VARIANT[tone]}>
      {Icon ? (
        <Icon
          data-icon="inline-start"
          className={cn(STATUS_TONE_ICON_CLASS[tone])}
        />
      ) : null}
      {label}
    </Badge>
  )
}
