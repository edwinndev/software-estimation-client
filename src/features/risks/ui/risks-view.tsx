"use client"

import { CheckIcon, XIcon } from "lucide-react"
import { useProjectCosts } from "@/features/costs/hooks/use-project-costs"
import { useSprintCalculation } from "@/features/estimates/hooks/use-sprint-calculation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { toCalendarDays } from "@/lib/calendar-time"
import { formatCurrency } from "@/lib/format"
import { isSchemaValid } from "@/lib/form-valid"
import { useRiskManager } from "../hooks/use-risk-manager"
import { riskConfigSchema } from "../schemas/risk-schema"
import { ContingencyImpactCard } from "./contingency-impact-card"
import { RiskLevelSelector } from "./risk-level-selector"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type RisksViewProps = {
  projectId: string
}

export const RisksView = ({ projectId }: RisksViewProps) => {
  const { calculation, isLoading: isLoadingTime } =
    useSprintCalculation(projectId)
  const { data: costs, isLoading: isLoadingCosts } = useProjectCosts(projectId)
  const baseTime = toCalendarDays(
    calculation.totalBaseTime,
    calculation.sprintUnit
  )
  const baseCost = costs ? costs.totalCost : 0
  const {
    level,
    margin,
    impact,
    isLoading: isLoadingConfig,
    isSaving,
    handleLevelChange,
    handleMarginChange,
    saveConfig,
    handleCancel,
  } = useRiskManager({ projectId, baseTime, baseCost })
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditRisks

  const onSave = async () => {
    try {
      await saveConfig.mutateAsync()
      toast.add({
        title: "Configuración guardada",
        description: "El margen de contingencia se actualizó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo guardar",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  if (isLoadingTime || isLoadingCosts || isLoadingConfig) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Riesgo y contingencia
        </h1>
        <p className="text-muted-foreground text-sm">
          Aplica un margen sobre el tiempo calendario y el costo en soles
          calculados en Estimación y Costos.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <Label className="mb-3 block text-base font-semibold">
            Nivel de riesgo
          </Label>
          <RiskLevelSelector
            currentLevel={level}
            disabled={!canWrite}
            onLevelChange={handleLevelChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="margin" className="text-base font-semibold">
            Margen de contingencia (%)
          </Label>
          <div className="flex items-center gap-4">
            <NumberInput
              id="margin"
              value={margin}
              min={0}
              max={100}
              step={1}
              disabled={isSaving || !canWrite}
              invalid={false}
              className="max-w-[180px]"
              onBlur={() => undefined}
              onChange={handleMarginChange}
            />
            <Button
              type="button"
              variant="secondary"
              className="whitespace-nowrap"
              disabled={isSaving || !canWrite}
              onClick={() => handleLevelChange(level)}
            >
              Ajustes predeterminados
            </Button>
          </div>
        </div>
      </div>

      <ContingencyImpactCard impact={impact} />

      <div className="flex justify-start gap-3 pt-2">
        <Button
          type="button"
          disabled={
            isSaving ||
            !canWrite ||
            !isSchemaValid(riskConfigSchema, {
              level,
              contingencyMargin: margin,
            })
          }
          onClick={() => {
            void onSave()
          }}
        >
          <CheckIcon />
          Guardar
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving || !canWrite}
          onClick={handleCancel}
        >
          <XIcon />
          Cancelar
        </Button>
      </div>

      <p className="text-muted-foreground border-t pt-4 text-sm">
        El nivel de riesgo{" "}
        <span className="font-semibold">
          {level === "low" ? "bajo" : level === "high" ? "alto" : "medio"}
        </span>{" "}
        aplica un margen del <span className="font-semibold">{margin}%</span>{" "}
        sobre el tiempo ({impact.totalTime.toFixed(1)} días) y el costo (
        {formatCurrency(impact.totalCost)}).
      </p>
    </div>
  )
}
