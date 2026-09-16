import { CircleUserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const UserStatus = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    return (
      <Badge variant="default">
        <CircleUserRound className="mr-2" /> Cuenta Activa
      </Badge>
    )
  }

  return (
    <Badge variant="destructive">
      <CircleUserRound className="mr-2" /> Cuenta Suspendida
    </Badge>
  )
}
