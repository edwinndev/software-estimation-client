"use client"

import {
  useGlobalSystemReports,
  useGlobalReportsHistory,
} from "../hooks/use-global-reports"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalculatorIcon,
  TrendingUpIcon,
  FileTextIcon,
  FolderKanbanIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { reportsService } from "../services/reports.service"
import { toast } from "@/components/ui/toast"

export const GlobalReportsView = () => {
  const queryClient = useQueryClient()
  const { data: report, isLoading } = useGlobalSystemReports()
  const { data: history, isLoading: historyLoading } = useGlobalReportsHistory()

  const handleCaptureSnapshot = async () => {
    if (!report || report.projectSummaries.length === 0) return

    let count = 0
    for (const summary of report.projectSummaries) {
      if (summary.latestEstimate) {
        await reportsService.saveSnapshot(summary.latestEstimate)
        count++
      }
    }

    if (count > 0) {
      queryClient.invalidateQueries({ queryKey: ["global-reports"] })
      toast.add({
        title: "Historial registrado",
        description: `Se han guardado con éxito ${count} estimaciones en el historial.`,
        type: "success",
      })
    } else {
      toast.add({
        title: "Sin datos",
        description: "No hay estimaciones activas para guardar.",
        type: "error",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Cargando reporte global del sistema...
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar el reporte.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reportes Generales del Sistema
          </h1>
          <p className="text-muted-foreground text-sm">
            Vista administrativa consolidada de todos los proyectos,
            estimaciones y costos.
          </p>
        </div>
        <Button onClick={handleCaptureSnapshot}>
          <SaveIcon className="mr-2 h-4 w-4" />
          Registrar Instantánea Actual
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard Consolidado</TabsTrigger>
          <TabsTrigger value="history">
            Historial Global de Estimaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 flex flex-col gap-6">
          {/* Global KPIs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Proyectos
                </CardTitle>
                <FolderKanbanIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.totalProjects}</div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {report.totalEstimatesCompleted} con estimación
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Esfuerzo Total (SP)
                </CardTitle>
                <CalculatorIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.totalSystemStoryPoints}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Suma de Story Points globales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tiempo Base Total (Días)
                </CardTitle>
                <FileTextIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.totalSystemBaseTime.toFixed(1)}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Esfuerzo neto estimado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Costo Total Sistema
                </CardTitle>
                <TrendingUpIcon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${report.totalSystemCost.toFixed(2)}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Incluye ${report.totalSystemContingencyCost.toFixed(2)} de
                  contingencia
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Desglose por Proyecto</CardTitle>
              <CardDescription>
                Análisis individual de la última estimación de cada proyecto
                activo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Puntos (SP)</TableHead>
                    <TableHead>Tiempo Base</TableHead>
                    <TableHead>Riesgo</TableHead>
                    <TableHead>Costo Estimado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.projectSummaries.map((summary) => (
                    <TableRow key={summary.projectId}>
                      <TableCell className="font-medium">
                        {summary.projectName}
                      </TableCell>
                      <TableCell className="capitalize">
                        {summary.projectStatus}
                      </TableCell>

                      {summary.latestEstimate ? (
                        <>
                          <TableCell>
                            {summary.latestEstimate.baseEffortPoints}
                          </TableCell>
                          <TableCell>
                            {summary.latestEstimate.baseTime.toFixed(1)}{" "}
                            {summary.latestEstimate.timeUnit}
                          </TableCell>
                          <TableCell className="capitalize">
                            {summary.latestEstimate.riskLevel} (
                            {summary.latestEstimate.contingencyMarginPercentage}
                            %)
                          </TableCell>
                          <TableCell>
                            ${summary.latestEstimate.totalCost.toFixed(2)}
                          </TableCell>
                        </>
                      ) : (
                        <TableCell
                          colSpan={4}
                          className="text-muted-foreground text-center italic"
                        >
                          Sin estimación o sin calcular
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                  {report.projectSummaries.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-6 text-center"
                      >
                        No hay proyectos registrados en el sistema.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Estimaciones (Global)</CardTitle>
              <CardDescription>
                Registro histórico de estimaciones guardadas para todos los
                proyectos del sistema. (Tickets PMGT-50 y PMGT-51)
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
                      <TableHead>Fecha de Captura</TableHead>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Riesgo Aplicado</TableHead>
                      <TableHead>Puntos (SP)</TableHead>
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
                        <TableCell>{snapshot.projectName}</TableCell>
                        <TableCell className="capitalize">
                          {snapshot.riskLevel} (
                          {snapshot.contingencyMarginPercentage}%)
                        </TableCell>
                        <TableCell>{snapshot.baseEffortPoints}</TableCell>
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
