export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger"

export type StatusBadgeVariant =
  "muted" | "info" | "success" | "warning" | "destructive"

export const STATUS_TONE_BADGE_VARIANT: Record<StatusTone, StatusBadgeVariant> =
  {
    neutral: "muted",
    info: "info",
    success: "success",
    warning: "warning",
    danger: "destructive",
  }

export const STATUS_TONE_ICON_CLASS: Record<StatusTone, string> = {
  neutral: "!text-muted-foreground",
  info: "!text-sky-600 dark:!text-sky-400",
  success: "!text-emerald-600 dark:!text-emerald-400",
  warning: "!text-amber-600 dark:!text-amber-400",
  danger: "!text-destructive",
}
