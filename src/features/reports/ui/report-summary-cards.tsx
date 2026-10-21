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
      {/* Esfuerzo - Teal (Verde medio celeste) sólido */}
      <Card className="border-0 bg-teal-600 text-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-100">
            Esfuerzo
          </CardTitle>
          <CalculatorIcon className="size-5 text-white/90" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tracking-tight text-white">
            {snapshot.baseEffortPoints} SP
          </p>
          <p className="mt-1 text-xs text-teal-100/80">
            {snapshot.storiesWithPoints} de {snapshot.storiesTotal} historias ·{" "}
            {snapshot.totalSprints} sprints
          </p>
        </CardContent>
      </Card>

      {/* Tiempo - Borgoña / Vino sólido */}
      <Card className="border-0 bg-rose-700 text-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-100">
            Tiempo
          </CardTitle>
          <Clock3Icon className="size-5 text-white/90" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tracking-tight text-white">
            {snapshot.totalTime} {unit}
          </p>
          <p className="mt-1 text-xs text-rose-100/80">
            Base {snapshot.baseTime} {unit} + {snapshot.contingencyTime} por
            riesgo {riskLevelLabel(snapshot.riskLevel)}
          </p>
        </CardContent>
      </Card>

      {/* Costo - Carbón grafito / Pizarra sólido */}
      <Card className="border-0 bg-slate-800 text-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            Costo
          </CardTitle>
          <BanknoteIcon className="size-5 text-white/90" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(snapshot.totalCost)}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Base {formatCurrency(snapshot.baseCost)} · margen{" "}
            {snapshot.contingencyMarginPercentage}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
