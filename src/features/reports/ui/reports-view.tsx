"use client"

import { useState } from "react"
import { FileDownIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import {
  useExportProjectReportPdf,
  useLatestEstimate,
  useReportsHistory,
  useSaveReportSnapshot,
} from "../hooks/use-reports"
import type { ReportSnapshot } from "../types"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"
import { ReportFactSheet } from "./report-fact-sheet"
import { ReportHistoryTable } from "./report-history-table"
import { ReportSummaryCards } from "./report-summary-cards"

type ReportsViewProps = {
  projectId: string
}

export const ReportsView = ({ projectId }: ReportsViewProps) => {
  const { data: latest, isLoading: latestLoading } =
    useLatestEstimate(projectId)
  const { data: history, isLoading: historyLoading } =
    useReportsHistory(projectId)
  const saveSnapshot = useSaveReportSnapshot()
  const exportPdf = useExportProjectReportPdf()
  const access = useProjectAccess(projectId)
  const [exportingId, setExportingId] = useState("")

  const handleSave = async () => {
    if (!latest || !access.canSaveReport) {
      return
    }
    try {
      await saveSnapshot.mutateAsync(latest)
      toast.add({
        title: "Estimación guardada",
        description: "Se guardó en el historial.",
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

  const handleExport = async (snapshot: ReportSnapshot) => {
    const rowId = snapshot.id.length > 0 ? snapshot.id : snapshot.createdAt
    setExportingId(rowId)
    try {
      await exportPdf.mutateAsync(snapshot)
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
    } finally {
      setExportingId("")
    }
  }

  if (latestLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!latest) {
    return (
      <p className="text-muted-foreground text-sm">
        No se pudo cargar el reporte del proyecto.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reportes del proyecto
          </h1>
          <p className="text-muted-foreground text-sm">
            Consolida puntos, tiempo calendario, horas × CER y el margen de
            riesgo guardado.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={exportingId.length > 0}
            onClick={() => {
              void handleExport(latest)
            }}
          >
            <FileDownIcon />
            Descargar PDF
          </Button>
          <Button
            type="button"
            disabled={saveSnapshot.isPending || !access.canSaveReport}
            onClick={() => {
              void handleSave()
            }}
          >
            <SaveIcon />
            Guardar en historial
          </Button>
        </div>
      </div>

      <ReportSummaryCards snapshot={latest} />

      <ReportFactSheet snapshot={latest} />

      <Card>
        <CardHeader>
          <CardTitle>Historial de estimaciones</CardTitle>
          <CardDescription>
            Cada fila es una instantánea guardada. Puedes descargar el PDF de
            esa estimación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <ReportHistoryTable
              snapshots={history ?? []}
              emptyLabel="Aún no hay estimaciones guardadas en el historial."
              exportingId={exportingId}
              onExport={(snapshot) => {
                void handleExport(snapshot)
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
