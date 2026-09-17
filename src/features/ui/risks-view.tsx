"use client";

import { useRiskManager } from "../hooks/use-risk-manager";
import { RiskLevelSelector } from "./risk-level-selector";
import { ContingencyImpactCard } from "./contingency-impact-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface RisksViewProps {
  projectId: string;
  baseTime: number;
  baseCost: number;
}

export const RisksView = ({ projectId, baseTime, baseCost }: RisksViewProps) => {
  const {
    level,
    margin,
    impact,
    handleLevelChange,
    handleMarginChange,
    handleSave,
    handleCancel
  } = useRiskManager({ projectId, baseTime, baseCost });

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-background rounded-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Configuración y Resumen de Contingencia (Proyecto #{projectId})
        </h1>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            PMGT-45: Nivel de Riesgo
          </Label>
          <RiskLevelSelector currentLevel={level} onLevelChange={handleLevelChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin" className="text-base font-semibold">
            PMGT-44: Margen de Contingencia (%)
          </Label>
          <div className="flex gap-4 items-center">
            <Input
              id="margin"
              type="number"
              value={margin}
              onChange={(e) => handleMarginChange(Number(e.target.value))}
              className="max-w-[150px]"
              min={0}
              max={100}
            />
            <Button variant="secondary" className="whitespace-nowrap">
              Ajustes Predeterminados
            </Button>
          </div>
        </div>
      </div>

      <ContingencyImpactCard impact={impact} />

      <div className="flex gap-3 justify-start pt-2">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          Aceptar
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>

      <p className="text-sm text-muted-foreground border-t pt-4">
        El nivel de riesgo <span className="font-semibold capitalize">{level}</span> aplica un margen del{' '}
        <span className="font-semibold">{margin}%</span> sobre el tiempo ({impact.totalTime.toFixed(0)} días totales)
        y costo (${impact.totalCost.toLocaleString()} CER totales).
      </p>
    </div>
  );
};
