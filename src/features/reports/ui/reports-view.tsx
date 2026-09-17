"use client"

import {
  useLatestEstimate,
  useReportsHistory,
  useSaveReportSnapshot,
} from "../hooks/use-reports"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  SaveIcon,
  FileTextIcon,
  CalculatorIcon,
  TrendingUpIcon,
} from "lucide-react"

interface ReportsViewProps {
  projectId: string
}

export const ReportsView = ({ projectId }: ReportsViewProps) => {
  const { data: latest, isLoading: latestLoading } =
    useLatestEstimate(projectId)
  const { data: history, isLoading: historyLoading } =
    useReportsHistory(projectId)
  const saveSnapshot = useSaveReportSnapshot()

  const handleSave = () => {
    if (!latest) return
    saveSnapshot.mutate(latest, {
      onSuccess: () => {
        toast.add({
          title: "Reporte guardado",
          description: "La estimación se ha guardado en el historial.",
          type: "success",
        })
      },
      onError: () => {
        toast.add({
          title: "Error",
          description: "No se pudo guardar la estimación.",
          type: "error",
        })
      },
    })
  }

  if (latestLoading) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Cargando reportes...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reportes y análisis
          </h1>
          <p className="text-muted-foreground text-sm">
            Visualización consolidada de estimaciones base vs contingencia y
            exportación de reportes para el proyecto #{projectId}.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveSnapshot.isPending || !latest}
        >
          <SaveIcon className="mr-2 size-4" />
          {saveSnapshot.isPending
            ? "Guardando..."
            : "Guardar estimación actual"}
        </Button>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Consolidado Actual</TabsTrigger>
          <TabsTrigger value="history">Historial de Estimaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="mt-6 flex flex-col gap-6">
          {/* Base vs Contingency Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Esfuerzo Base (Story Points)
                </CardTitle>
                <CalculatorIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latest?.baseEffortPoints || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tiempo (Base vs Total)
                </CardTitle>
                <FileTextIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latest?.baseTime.toFixed(1)}{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    base
                  </span>
                  {" -> "}
                  {latest?.totalTime.toFixed(1)}{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    {latest?.timeUnit}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  +{latest?.contingencyTime.toFixed(1)} por riesgo (
                  {latest?.riskLevel})
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Costo (Base vs Total)
                </CardTitle>
                <TrendingUpIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${latest?.baseCost.toFixed(2)}{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    base
                  </span>
                  <br />${latest?.totalCost.toFixed(2)}{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    total
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Margen aplicado: {latest?.contingencyMarginPercentage}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Estimaciones</CardTitle>
              <CardDescription>
                Registro histórico de estimaciones guardadas para este proyecto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="text-muted-foreground py-4 text-center text-sm">
                  Cargando historial...
                </div>
              ) : history && history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Riesgo</TableHead>
                      <TableHead>SP Base</TableHead>
                      <TableHead>Tiempo Base</TableHead>
                      <TableHead>Tiempo Total</TableHead>
                      <TableHead>Costo Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((snapshot) => (
                      <TableRow key={snapshot.id}>
                        <TableCell className="font-medium">
                          {new Date(snapshot.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="capitalize">
                          {snapshot.riskLevel} (
                          {snapshot.contingencyMarginPercentage}%)
                        </TableCell>
                        <TableCell>{snapshot.baseEffortPoints}</TableCell>
                        <TableCell>
                          {snapshot.baseTime.toFixed(1)} {snapshot.timeUnit}
                        </TableCell>
                        <TableCell>
                          {snapshot.totalTime.toFixed(1)} {snapshot.timeUnit}
                        </TableCell>
                        <TableCell>${snapshot.totalCost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Aún no hay estimaciones guardadas en el historial.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
