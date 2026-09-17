import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

interface AuthFieldProps {
  label: string
  htmlFor: string
  error: string
  hint?: string
  children: ReactNode
}

export const AuthField = ({
  label,
  htmlFor,
  error,
  hint,
  children,
}: AuthFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {!error && hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  )
}
