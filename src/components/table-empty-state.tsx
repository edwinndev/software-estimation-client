import type { LucideIcon } from "lucide-react"
import { InboxIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TableEmptyStateProps = {
  message: string
  icon?: LucideIcon
  className?: string
}

export const TableEmptyState = ({
  message,
  icon: Icon = InboxIcon,
  className,
}: TableEmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12",
        className
      )}
    >
      <Icon className="text-muted-foreground size-10" strokeWidth={1.5} />
      <p className="text-muted-foreground max-w-xs text-center text-sm">
        {message}
      </p>
    </div>
  )
}
