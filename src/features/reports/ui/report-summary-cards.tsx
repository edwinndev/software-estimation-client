"use client"

import { CalculatorIcon, Clock3Icon, BanknoteIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import type { ReportSnapshot } from "../types"
import { riskLevelLabel } from "../utils/report-labels"

type ReportSummaryCardsProps = {
  snapshot: ReportSnapshot
}

export const ReportSummaryCards = ({ snapshot }: ReportSummaryCardsProps) => {
  const unit = timeUnitLabel(snapshot.timeUnit)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Esfuerzo</CardTitle>
          <CalculatorIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{snapshot.baseEffortPoints} SP</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {snapshot.storiesWithPoints} de {snapshot.storiesTotal} historias ·{" "}
            {snapshot.totalSprints} sprints
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo</CardTitle>
          <Clock3Icon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {snapshot.totalTime} {unit}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Base {snapshot.baseTime} {unit} + {snapshot.contingencyTime} por
            riesgo {riskLevelLabel(snapshot.riskLevel)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Costo</CardTitle>
          <BanknoteIcon className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatCurrency(snapshot.totalCost)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Base {formatCurrency(snapshot.baseCost)} · margen{" "}
            {snapshot.contingencyMarginPercentage}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
