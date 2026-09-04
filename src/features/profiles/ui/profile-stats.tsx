import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, DollarSignIcon, AwardIcon } from "lucide-react"
import type { Profile } from "../types"

type ProfileStatsProps = {
  profiles: Profile[]
}

export const ProfileStats = ({ profiles }: ProfileStatsProps) => {
  const totalProfiles = profiles.length
  const activeProfiles = profiles.filter((p) => p.isActive).length
  const avgCer =
    totalProfiles > 0
      ? profiles.reduce((acc, curr) => acc + curr.hourlyRate, 0) / totalProfiles
      : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Total de perfiles
          </CardTitle>
          <UsersIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProfiles}</div>
          <p className="text-muted-foreground text-xs">
            {activeProfiles} activos para proyectos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            CER promedio por hora
          </CardTitle>
          <DollarSignIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${avgCer.toFixed(2)}</div>
          <p className="text-muted-foreground text-xs">
            Costo estándar promedio por hora
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Cobertura de seniority
          </CardTitle>
          <AwardIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {
              profiles.filter(
                (p) =>
                  p.experienceLevel === "Senior" || p.experienceLevel === "Lead"
              ).length
            }
          </div>
          <p className="text-muted-foreground text-xs">
            Recursos Senior / Lead
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
