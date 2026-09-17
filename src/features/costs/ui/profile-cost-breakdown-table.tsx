import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProfileCostBreakdown } from "../types/profile-cost-breakdown"

interface ProfileCostBreakdownTableProps {
  profileBreakdown: readonly ProfileCostBreakdown[]
}

export const ProfileCostBreakdownTable = ({
  profileBreakdown,
}: ProfileCostBreakdownTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por perfil técnico</CardTitle>
        <CardDescription>
          Horas, CER y costo acumulado para cada perfil asignado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Perfil técnico</TableHead>
              <TableHead className="text-right">Horas totales</TableHead>
              <TableHead className="text-right">CER</TableHead>
              <TableHead className="text-right">Costo total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profileBreakdown.map((profile) => (
              <TableRow key={profile.profileId}>
                <TableCell className="font-medium">
                  {profile.profileName}
                </TableCell>
                <TableCell className="text-right">
                  {profile.totalHours}
                </TableCell>
                <TableCell className="text-right">{profile.cer}</TableCell>
                <TableCell className="text-right">
                  {profile.totalCost}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
