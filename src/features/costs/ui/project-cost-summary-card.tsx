import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"

interface ProjectCostSummaryCardProps {
  totalCost: number
}

export const ProjectCostSummaryCard = ({
  totalCost,
}: ProjectCostSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Costo total estimado del proyecto</CardDescription>
        <CardTitle className="text-3xl">{formatCurrency(totalCost)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Suma de horas × CER (soles) de todas las tareas.
        </p>
      </CardContent>
    </Card>
  )
}
