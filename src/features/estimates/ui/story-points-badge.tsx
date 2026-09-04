import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StoryPointsBadgeProps {
  points: number
  className?: string
}

/**
 * Pill visual para mostrar los Story Points de una historia de usuario.
 * Cambia de color según el tamaño relativo del esfuerzo:
 * - Bajo (1-3 SP): neutro
 * - Medio (5-13 SP): secundario
 * - Alto (20-40 SP): outline (llama la atención)
 */
export const StoryPointsBadge = ({
  points,
  className,
}: StoryPointsBadgeProps) => {
  const variant =
    points <= 3 ? "default" : points <= 13 ? "secondary" : "outline"

  return (
    <Badge variant={variant} className={cn("tabular-nums", className)}>
      {points} SP
    </Badge>
  )
}
