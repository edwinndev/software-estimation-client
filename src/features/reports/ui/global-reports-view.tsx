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
    <div className="flex flex-col gap-4">
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
        {/* Proyectos - Teal (Verde medio celeste) sólido */}
        <Card className="border-0 bg-teal-600 text-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-100">
              Proyectos
            </CardTitle>
            <FolderKanbanIcon className="size-5 text-white/90" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-white">
              {report.totalProjects}
            </p>
            <p className="mt-1 text-xs text-teal-100/80">
              {report.totalEstimatesCompleted} con estimación
            </p>
          </CardContent>
        </Card>

        {/* Puntos de historia - Violeta oscuro / Mora sólido */}
        <Card className="border-0 bg-violet-800 text-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">
              Puntos de historia
            </CardTitle>
            <CalculatorIcon className="size-5 text-white/90" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-white">
              {report.totalSystemStoryPoints}
            </p>
            <p className="mt-1 text-xs text-purple-100/80">
              Total acumulado del sistema
            </p>
          </CardContent>
        </Card>

        {/* Tiempo base - Ámbar / Miel sólido */}
        <Card className="border-0 bg-amber-600 text-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">
              Tiempo base
            </CardTitle>
            <FileTextIcon className="size-5 text-white/90" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-white">
              {report.totalSystemBaseTime.toFixed(1)} días
            </p>
            <p className="mt-1 text-xs text-amber-100/80">
              Suma de todos los proyectos
            </p>
          </CardContent>
        </Card>

        {/* Costo total - Carbón grafito / Pizarra sólido */}
        <Card className="border-0 bg-slate-800 text-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Costo total
            </CardTitle>
            <TrendingUpIcon className="size-5 text-white/90" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-white">
              {formatCurrency(report.totalSystemCost)}
            </p>
            <p className="mt-1 text-xs text-slate-300">
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
