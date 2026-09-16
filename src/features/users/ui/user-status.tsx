import { Badge } from "@/components/ui/badge"

export const UserStatus = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    return <Badge variant="default">Cuenta Activa</Badge>
  }

  return <Badge variant="destructive">Cuenta Suspendida</Badge>
}
