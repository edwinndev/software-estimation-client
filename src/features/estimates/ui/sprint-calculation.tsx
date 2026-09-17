"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSprintCalculation } from "../hooks/use-sprint-calculation"

type SprintCalculationProps = {
  projectId: string
}

const unitLabel = (unit: "dias" | "semanas") =>
  unit === "semanas" ? "semanas" : "días"

export const SprintCalculation = ({ projectId }: SprintCalculationProps) => {
  const { calculation, isLoading } = useSprintCalculation(projectId)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const missingPoints =
    calculation.storiesTotal > 0 &&
    calculation.storiesWithPoints < calculation.storiesTotal
  const missingHours =
    calculation.tasksTotal > 0 &&
    calculation.tasksWithHours < calculation.tasksTotal

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Datos de entrada</CardTitle>
          <CardDescription>
            Se toman solos de las historias, las tareas y la configuración del
            sprint.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Historias con SP</span>
            <span className="font-medium tabular-nums">
              {calculation.storiesWithPoints} / {calculation.storiesTotal}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Backlog total</span>
            <span className="font-medium tabular-nums">
              {calculation.totalStoryPoints} SP
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Velocidad del equipo</span>
            <span className="font-medium tabular-nums">
              {calculation.velocity} SP / sprint
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Duración del sprint</span>
            <span className="font-medium tabular-nums">
              {calculation.sprintDuration} {unitLabel(calculation.sprintUnit)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Tareas con horas</span>
            <span className="font-medium tabular-nums">
              {calculation.tasksWithHours} / {calculation.tasksTotal}
            </span>
          </div>
          {missingPoints ? (
            <p className="text-xs text-amber-600">
              Hay historias sin Story Points. El calendario usa solo las
              asignadas.
            </p>
          ) : null}
          {missingHours ? (
            <p className="text-xs text-amber-600">
              Hay tareas en 0 h. Revisa la pestaña de horas por tarea.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            Sprints = Story Points / velocidad. Tiempo calendario = sprints ×
            duración. Esfuerzo = suma de horas de las tareas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="font-semibold">Sprints</span>
            <span className="text-primary font-mono text-lg font-semibold tabular-nums">
              {calculation.totalSprints}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="font-semibold">Tiempo calendario</span>
            <span className="text-primary font-mono text-lg font-semibold tabular-nums">
              {calculation.totalBaseTime} {unitLabel(calculation.sprintUnit)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="font-semibold">Esfuerzo total</span>
            <span className="text-primary font-mono text-lg font-semibold tabular-nums">
              {calculation.totalEffortHours} h
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
