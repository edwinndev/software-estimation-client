"use client"

import { useState } from "react"
import {
  BookOpenIcon,
  CalculatorIcon,
  ClockIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SprintCalculation } from "./sprint-calculation"
import { SprintTeamConfigForm } from "./sprint-team-config-form"
import { TaskHoursTable } from "./task-hours-table"
import { UserStoryTable } from "./user-story-table"

const ACTIVE_TAB_STORAGE_KEY = "estimation-active-tab"
const VALID_TABS = ["historias", "config", "calculo", "horas"]

type EstimationViewProps = {
  projectId: string
}

export const EstimationView = ({ projectId }: EstimationViewProps) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "historias"
    }

    const savedTab = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY)
    if (savedTab && VALID_TABS.includes(savedTab)) {
      return savedTab
    }

    return "historias"
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab)
  }

  const getTriggerClass = (tabKey: string) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
      activeTab === tabKey
        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`

  return (
    <div className="flex min-h-full w-full flex-col gap-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estimación ágil</h1>
        <p className="text-muted-foreground text-sm">
          Calcula sprints, tiempo estimado y asignación de horas de esfuerzo.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex h-auto flex-wrap items-center justify-start gap-1 border-b bg-transparent p-0 pb-2 text-sm font-medium">
          <TabsTrigger
            value="historias"
            className={getTriggerClass("historias")}
          >
            <BookOpenIcon className="size-4" />
            <span>Historias y puntos</span>
          </TabsTrigger>
          <TabsTrigger value="config" className={getTriggerClass("config")}>
            <SlidersHorizontalIcon className="size-4" />
            <span>Configuración de sprint</span>
          </TabsTrigger>
          <TabsTrigger value="calculo" className={getTriggerClass("calculo")}>
            <CalculatorIcon className="size-4" />
            <span>Cálculo de tiempo</span>
          </TabsTrigger>
          <TabsTrigger value="horas" className={getTriggerClass("horas")}>
            <ClockIcon className="size-4" />
            <span>Horas por tarea</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="historias" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Story Points por historia</CardTitle>
              <CardDescription>
                Asigna Story Points a cada historia. El total alimenta el
                cálculo de sprints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserStoryTable projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del equipo y sprint</CardTitle>
              <CardDescription>
                Velocidad y duración. El tiempo calendario se recalcula solo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SprintTeamConfigForm projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculo" className="pt-2">
          <SprintCalculation projectId={projectId} />
        </TabsContent>

        <TabsContent value="horas" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Horas estimadas por tarea</CardTitle>
              <CardDescription>
                Las horas salen de la estimación de cada tarea y se reparte
                entre los perfiles asignados. Puedes ajustarlas si hace falta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskHoursTable projectId={projectId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
