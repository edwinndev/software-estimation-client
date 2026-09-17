"use client"

import { FileDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import type { ReportSnapshot } from "../types"
import { riskLevelLabel, riskLevelVariant } from "../utils/report-labels"

type ReportHistoryTableProps = {
  snapshots: ReportSnapshot[]
  emptyLabel: string
  exportingId: string
  onExport: (snapshot: ReportSnapshot) => void
}

export const ReportHistoryTable = ({
  snapshots,
  emptyLabel,
  exportingId,
  onExport,
}: ReportHistoryTableProps) => {
  if (snapshots.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {emptyLabel}
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Riesgo</TableHead>
          <TableHead>Puntos</TableHead>
          <TableHead>Tiempo total</TableHead>
          <TableHead>Costo total</TableHead>
          <TableHead className="w-20 text-right">PDF</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {snapshots.map((snapshot) => {
          const rowId =
            snapshot.id.length > 0 ? snapshot.id : snapshot.createdAt

          return (
            <TableRow key={rowId}>
              <TableCell className="font-medium">
                {snapshot.createdAt.length > 0
                  ? formatDate(snapshot.createdAt)
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={riskLevelVariant(snapshot.riskLevel)}>
                  {riskLevelLabel(snapshot.riskLevel)} (
                  {snapshot.contingencyMarginPercentage}%)
                </Badge>
              </TableCell>
              <TableCell>{snapshot.baseEffortPoints}</TableCell>
              <TableCell>
                {snapshot.totalTime} {timeUnitLabel(snapshot.timeUnit)}
              </TableCell>
              <TableCell>{formatCurrency(snapshot.totalCost)}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={exportingId.length > 0}
                  onClick={() => onExport(snapshot)}
                >
                  <FileDownIcon />
                  <span className="sr-only">
                    Descargar PDF de esta estimación
                  </span>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
