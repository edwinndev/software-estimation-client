import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, BanknoteIcon, AwardIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format"
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
      {/* Total de perfiles - Teal (Verde medio celeste) sólido */}
      <Card className="border-0 bg-teal-600 text-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-teal-100">
            Total de perfiles
          </CardTitle>
          <UsersIcon className="size-5 text-white/90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-white">
            {totalProfiles}
          </div>
          <p className="mt-1 text-xs text-teal-100/80">
            {activeProfiles} activos para proyectos
          </p>
        </CardContent>
      </Card>

      {/* CER promedio - Borgoña / Vino sólido */}
      <Card className="border-0 bg-rose-700 text-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-rose-100">
            CER promedio por hora
          </CardTitle>
          <BanknoteIcon className="size-5 text-white/90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(avgCer)}
          </div>
          <p className="mt-1 text-xs text-rose-100/80">
            Costo estándar promedio por hora
          </p>
        </CardContent>
      </Card>

      {/* Cobertura de seniority - Carbón grafito / Pizarra sólido */}
      <Card className="border-0 bg-slate-800 text-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            Cobertura de seniority
          </CardTitle>
          <AwardIcon className="size-5 text-white/90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-white">
            {
              profiles.filter(
                (p) =>
                  p.experienceLevel === "Senior" || p.experienceLevel === "Lead"
              ).length
            }
          </div>
          <p className="mt-1 text-xs text-slate-300">Recursos Senior / Lead</p>
        </CardContent>
      </Card>
    </div>
  )
}
