import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { EstimationImpact } from "../types"
import { ArrowUp, Clock, Banknote } from "lucide-react"

interface ContingencyImpactCardProps {
  impact: EstimationImpact
}

export const ContingencyImpactCard = ({
  impact,
}: ContingencyImpactCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" /> Impacto en tiempo (días)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Tiempo Estimado Original:
            </span>
            <span className="font-medium">{impact.originalTime} días</span>
          </div>
          <div className="flex justify-between font-medium text-yellow-600">
            <span>+ Contingencia:</span>
            <span className="flex items-center gap-1">
              +{impact.contingencyTime.toFixed(1)} días{" "}
              <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 font-bold">
            <span>Tiempo Final Estimado:</span>
            <span>{impact.totalTime.toFixed(1)} días</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Banknote className="h-4 w-4" /> Impacto en costo (PEN)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Costo Estimado Base:</span>
            <span className="font-medium">
              {formatCurrency(impact.originalCost)}
            </span>
          </div>
          <div className="flex justify-between font-medium text-yellow-600">
            <span>+ Contingencia:</span>
            <span className="flex items-center gap-1">
              +{formatCurrency(impact.contingencyCost)}{" "}
              <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 font-bold">
            <span>Costo Final Estimado:</span>
            <span>{formatCurrency(impact.totalCost)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
