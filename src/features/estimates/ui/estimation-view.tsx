"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AdjustTaskHoursTable } from "./adjust-task-hours-table"
import { AssignStoryPointsForm } from "./assign-story-points-form"
import { SprintCalculation } from "./sprint-calculation"
import { SprintTeamConfigForm } from "./sprint-team-config-form"
import { TaskHoursForm } from "./task-hours-form"
import { UserStoryTable } from "./user-story-table"

interface EstimationViewProps {
  projectId: string
}

export const EstimationView = ({ projectId }: EstimationViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estimación ágil</h1>
        <p className="text-muted-foreground text-sm">
          Calcula sprints, tiempo estimado y asignación de horas de esfuerzo
          para el proyecto #{projectId}.
        </p>
      </div>

      <Tabs defaultValue="historias">
        <TabsList>
          <TabsTrigger value="historias">Historias &amp; Puntos</TabsTrigger>
          <TabsTrigger value="config">Configuración de Sprint</TabsTrigger>
          <TabsTrigger value="calculo">Cálculo de Tiempo</TabsTrigger>
          <TabsTrigger value="horas">Horas por Tarea</TabsTrigger>
        </TabsList>

        <TabsContent value="historias">
          <Card>
            <CardHeader>
              <CardTitle>Story Points por historia</CardTitle>
              <CardDescription>
                Asigna Story Points a cada historia de usuario del backlog.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <UserStoryTable />
              <Separator />
              <AssignStoryPointsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Equipo y Sprint</CardTitle>
              <CardDescription>
                Parámetros operativos del equipo para el motor de cálculo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SprintTeamConfigForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculo">
          <SprintCalculation />
        </TabsContent>

        <TabsContent value="horas">
          <Card>
            <CardHeader>
              <CardTitle>Horas estimadas por tarea</CardTitle>
              <CardDescription>
                Registra horas por perfil técnico y ajústalas manualmente si es
                necesario.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <TaskHoursForm />
              <Separator />
              <AdjustTaskHoursTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
