import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstimationImpact } from "../types";
import { ArrowUp, Clock, DollarSign } from "lucide-react";

interface ContingencyImpactCardProps {
  impact: EstimationImpact;
}

export const ContingencyImpactCard = ({ impact }: ContingencyImpactCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" /> PMGT-43: Impacto en Tiempo (Días)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo Estimado Original:</span>
            <span className="font-medium">{impact.originalTime} días</span>
          </div>
          <div className="flex justify-between text-yellow-600 font-medium">
            <span>+ Contingencia:</span>
            <span className="flex items-center gap-1">
              +{impact.contingencyTime.toFixed(1)} días <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Tiempo Final Estimado:</span>
            <span>{impact.totalTime.toFixed(1)} días</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" /> PMGT-42: Impacto en Costo (CER)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Costo Estimado Base:</span>
            <span className="font-medium">${impact.originalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-yellow-600 font-medium">
            <span>+ Contingencia:</span>
            <span className="flex items-center gap-1">
              +${impact.contingencyCost.toLocaleString()} <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Costo Final Estimado:</span>
            <span>${impact.totalCost.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
