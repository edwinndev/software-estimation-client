import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
        <CardTitle className="text-3xl">{totalCost}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Suma de los costos estimados de todas las tareas.
        </p>
      </CardContent>
    </Card>
  )
}
