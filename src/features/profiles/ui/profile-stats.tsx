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
            Total profiles
          </CardTitle>
          <UsersIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProfiles}</div>
          <p className="text-muted-foreground text-xs">
            {activeProfiles} active for projects
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Average CER / Hour
          </CardTitle>
          <DollarSignIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${avgCer.toFixed(2)}</div>
          <p className="text-muted-foreground text-xs">
            Standard baseline hourly rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Seniority coverage
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
            Senior / Lead resources
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
