"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RefreshCwIcon } from "lucide-react"
import { useSprintCalculation } from "../hooks/use-sprint-calculation"

export const SprintCalculation = () => {
  const { calculation, isRecalculating, recalculate } = useSprintCalculation()

  const handleRecalculate = () => {
    void recalculate()
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Cálculo de Tiempo</CardTitle>
        <CardDescription>
          Sprints = Total Story Points / Velocidad del Equipo. Tiempo Base =
          Sprints × Duración del Sprint.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="text-muted-foreground flex justify-between">
            <span>Backlog total</span>
            <span className="text-foreground font-medium">
              {calculation.totalStoryPoints} SP
            </span>
          </div>

          <div className="text-muted-foreground flex justify-between">
            <span>Velocidad del equipo</span>
            <span className="text-foreground font-medium">
              {calculation.velocity} SP/sprint
            </span>
          </div>

          <div className="text-muted-foreground flex justify-between">
            <span>Duración del sprint</span>
            <span className="text-foreground font-medium">
              {calculation.sprintDuration} {calculation.sprintUnit}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="w-fit"
        >
          <RefreshCwIcon
            className={`mr-2 size-4 ${isRecalculating ? "animate-spin" : ""}`}
          />
          {isRecalculating ? "Recalculando..." : "Recalcular Tiempo"}
        </Button>

        <div className="flex flex-col gap-2 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Sprints calculados</span>
            <span className="text-primary font-mono text-base font-semibold">
              {calculation.totalSprints}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Tiempo total base</span>
            <span className="text-primary font-mono text-base font-semibold">
              {calculation.totalBaseTime} {calculation.sprintUnit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
