"use client"

import {
  CalculatorIcon,
  FileDownIcon,
  FileTextIcon,
  FolderKanbanIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { formatCurrency } from "@/lib/format"
import {
  useExportSystemReportPdf,
  useGlobalSystemReports,
} from "../hooks/use-global-reports"
import { GlobalProjectsTable } from "./global-projects-table"

export const GlobalReportsView = () => {
  const { data: report, isLoading } = useGlobalSystemReports()
  const exportPdf = useExportSystemReportPdf()

  const handleExport = async () => {
    if (!report) {
      return
    }
    try {
      await exportPdf.mutateAsync(report)
      toast.add({
        title: "PDF generado",
        description: "El PDF se descargó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo generar el PDF",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!report) {
    return (
      <p className="text-muted-foreground text-sm">
        No se pudo cargar el reporte del sistema.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reportes del sistema
          </h1>
          <p className="text-muted-foreground text-sm">
            Totales actuales de todos los proyectos.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={exportPdf.isPending}
          onClick={() => {
            void handleExport()
          }}
        >
          <FileDownIcon />
          Descargar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <FolderKanbanIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report.totalProjects}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {report.totalEstimatesCompleted} con estimación
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Puntos de historia
            </CardTitle>
            <CalculatorIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {report.totalSystemStoryPoints}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo base</CardTitle>
            <FileTextIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {report.totalSystemBaseTime.toFixed(1)} días
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo total</CardTitle>
            <TrendingUpIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(report.totalSystemCost)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Incluye {formatCurrency(report.totalSystemContingencyCost)} de
              contingencia
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
          <CardDescription>
            Estimación vigente de cada proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalProjectsTable summaries={report.projectSummaries} />
        </CardContent>
      </Card>
    </div>
  )
}
