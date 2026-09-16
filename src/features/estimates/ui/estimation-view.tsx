"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpenIcon,
  SlidersHorizontalIcon,
  CalculatorIcon,
  ClockIcon,
} from "lucide-react"

import { AdjustTaskHoursTable } from "./adjust-task-hours-table"
import { AssignStoryPointsForm } from "./assign-story-points-form"
import { SprintCalculation } from "./sprint-calculation"
import { SprintTeamConfigForm } from "./sprint-team-config-form"
import { TaskHoursForm } from "./task-hours-form"
import { UserStoryTable } from "./user-story-table"

const ACTIVE_TAB_STORAGE_KEY = "estimation-active-tab"
const VALID_TABS = ["historias", "config", "calculo", "horas"]

interface EstimationViewProps {
  projectId: string
}

export const EstimationView = ({ projectId }: EstimationViewProps) => {
  // 1. Leer la última pestaña activa de localStorage al cargar la página
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY)
      if (savedTab && VALID_TABS.includes(savedTab)) {
        return savedTab
      }
    }
    return "historias"
  })

  // 2. Guardar en localStorage cuando cambies a cualquier pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (typeof window !== "undefined") {
      localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab)
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col gap-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estimación ágil</h1>
        <p className="text-muted-foreground text-sm">
          Calcula sprints, tiempo estimado y asignación de horas de esfuerzo
          para el proyecto #{projectId}.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Lista de pestañas con las mismas dimensiones y color del nav superior */}
        <TabsList className="flex h-auto flex-wrap items-center justify-start gap-1 border-b bg-transparent p-0 pb-2 text-sm font-medium">
          {/* 1. Historias & Puntos */}
          <TabsTrigger
            value="historias"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              activeTab === "historias"
                ? "!bg-primary !text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <BookOpenIcon className="size-4" />
            <span>Historias &amp; Puntos</span>
          </TabsTrigger>

          {/* 2. Configuración de Sprint */}
          <TabsTrigger
            value="config"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              activeTab === "config"
                ? "!bg-primary !text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <SlidersHorizontalIcon className="size-4" />
            <span>Configuración de Sprint</span>
          </TabsTrigger>

          {/* 3. Cálculo de Tiempo */}
          <TabsTrigger
            value="calculo"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              activeTab === "calculo"
                ? "!bg-primary !text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <CalculatorIcon className="size-4" />
            <span>Cálculo de Tiempo</span>
          </TabsTrigger>

          {/* 4. Horas por Tarea */}
          <TabsTrigger
            value="horas"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              activeTab === "horas"
                ? "!bg-primary !text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ClockIcon className="size-4" />
            <span>Horas por Tarea</span>
          </TabsTrigger>
        </TabsList>

        {/* CONTENIDOS */}
        <TabsContent value="historias" className="pt-2">
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

        <TabsContent value="config" className="pt-2">
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

        <TabsContent value="calculo" className="pt-2">
          <SprintCalculation />
        </TabsContent>

        <TabsContent value="horas" className="pt-2">
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
