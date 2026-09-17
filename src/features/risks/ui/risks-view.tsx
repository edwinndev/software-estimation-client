"use client"

import { useRiskManager } from "../hooks/use-risk-manager"
import { RiskLevelSelector } from "./risk-level-selector"
import { ContingencyImpactCard } from "./contingency-impact-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

interface RisksViewProps {
  projectId: string
  baseTime?: number
  baseCost?: number
}

export const RisksView = ({
  projectId,
  baseTime = 0,
  baseCost = 0,
}: RisksViewProps) => {
  const {
    level,
    margin,
    impact,
    handleLevelChange,
    handleMarginChange,
    handleSave,
    handleCancel,
  } = useRiskManager({ projectId, baseTime, baseCost })

  const onSave = async () => {
    try {
      await handleSave()
      toast.add({
        title: "Configuración guardada",
        description:
          "El margen de riesgo y contingencia se actualizó correctamente.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "Error al guardar",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la configuración de riesgo.",
        type: "error",
      })
    }
  }

  return (
    <div className="bg-background mx-auto max-w-4xl space-y-6 rounded-lg p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Configuración y resumen de contingencia (Proyecto #{projectId})
        </h1>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="mb-3 block text-base font-semibold">
            PMGT-45: Nivel de riesgo
          </Label>
          <RiskLevelSelector
            currentLevel={level}
            onLevelChange={handleLevelChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin" className="text-base font-semibold">
            PMGT-44: Margen de contingencia (%)
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="margin"
              type="number"
              value={margin}
              onChange={(e) => handleMarginChange(Number(e.target.value))}
              className="max-w-[150px]"
              min={0}
              max={100}
            />
            <Button
              type="button"
              variant="secondary"
              className="whitespace-nowrap"
              onClick={() => handleLevelChange(level)}
            >
              Ajustes predeterminados
            </Button>
          </div>
        </div>
      </div>

      <ContingencyImpactCard impact={impact} />

      <div className="flex justify-start gap-3 pt-2">
        <Button onClick={onSave}>Aceptar</Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>

      <p className="text-muted-foreground border-t pt-4 text-sm">
        El nivel de riesgo{" "}
        <span className="font-semibold capitalize">{level}</span> aplica un
        margen del <span className="font-semibold">{margin}%</span> sobre el
        tiempo ({impact.totalTime.toFixed(0)} días totales) y costo ($
        {impact.totalCost.toLocaleString()} CER totales).
      </p>
    </div>
  )
}
