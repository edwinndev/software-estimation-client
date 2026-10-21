"use client"

import { BarChart2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import { TableEmptyState } from "@/components/table-empty-state"
import type { ProjectReportSummary } from "../types"
import {
  projectStatusLabel,
  projectStatusVariant,
  projectTypeLabel,
  riskLevelLabel,
  riskLevelVariant,
} from "../utils/report-labels"

type GlobalProjectsTableProps = {
  summaries: ProjectReportSummary[]
}

export const GlobalProjectsTable = ({
  summaries,
}: GlobalProjectsTableProps) => {
  if (summaries.length === 0) {
    return (
      <TableEmptyState
        message="No hay proyectos registrados."
        icon={BarChart2Icon}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Proyecto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Puntos</TableHead>
          <TableHead>Tiempo base</TableHead>
          <TableHead>Riesgo</TableHead>
          <TableHead>Costo total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {summaries.map((summary) => {
          const estimate = summary.latestEstimate

          return (
            <TableRow key={summary.projectId}>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span className="font-medium">{summary.projectName}</span>
                  {summary.projectType.length > 0 ? (
                    <Badge
                      variant="outline"
                      size="sm"
                      className="h-4 px-1.5 font-normal"
                    >
                      {projectTypeLabel(summary.projectType)}
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={projectStatusVariant(summary.projectStatus)}>
                  {projectStatusLabel(summary.projectStatus)}
                </Badge>
              </TableCell>
              {estimate !== null ? (
                <>
                  <TableCell>{estimate.baseEffortPoints}</TableCell>
                  <TableCell>
                    {estimate.baseTime} {timeUnitLabel(estimate.timeUnit)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={riskLevelVariant(estimate.riskLevel)}>
                      {riskLevelLabel(estimate.riskLevel)} (
                      {estimate.contingencyMarginPercentage}%)
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(estimate.totalCost)}</TableCell>
                </>
              ) : (
                <TableCell colSpan={4} className="text-muted-foreground">
                  Sin estimación
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
