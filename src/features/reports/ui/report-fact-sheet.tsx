"use client"

import type { ReactNode } from "react"
import {
  BanknoteIcon,
  CalendarDaysIcon,
  Clock3Icon,
  FlagIcon,
  FolderKanbanIcon,
  ListTodoIcon,
  ShieldAlertIcon,
  UserRoundIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import type { ReportSnapshot } from "../types"
import {
  projectStatusLabel,
  projectStatusVariant,
  projectTypeLabel,
  riskLevelLabel,
  riskLevelVariant,
} from "../utils/report-labels"

type ReportFactSheetProps = {
  snapshot: ReportSnapshot
}

type FactItemProps = {
  label: string
  icon: ReactNode
  children: ReactNode
}

const FactItem = ({ label, icon, children }: FactItemProps) => {
  return (
    <div className="flex flex-col gap-2 border-b py-3 last:border-b-0 sm:border-r sm:border-b-0 sm:px-4 sm:py-0 sm:last:border-r-0">
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        {icon}
        {label}
      </p>
      <div>{children}</div>
    </div>
  )
}

export const ReportFactSheet = ({ snapshot }: ReportFactSheetProps) => {
  const unit = timeUnitLabel(snapshot.timeUnit)
  const projectName =
    snapshot.projectName.length > 0 ? snapshot.projectName : "Sin nombre"
  const owner = snapshot.projectOwner.length > 0 ? snapshot.projectOwner : "—"
  const statusLabel =
    snapshot.projectStatus.length > 0
      ? projectStatusLabel(snapshot.projectStatus)
      : "—"
  const typeLabel =
    snapshot.projectType.length > 0
      ? projectTypeLabel(snapshot.projectType)
      : "—"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ficha del informe</CardTitle>
        <CardDescription>
          Los importes salen de horas × CER. El tiempo extra usa el margen
          guardado en Riesgo y contingencia.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
        <FactItem
          label="Proyecto"
          icon={<FolderKanbanIcon className="size-3.5" />}
        >
          <p className="text-sm font-medium">{projectName}</p>
          {snapshot.projectType.length > 0 ? (
            <Badge
              variant="outline"
              size="sm"
              className="mt-1 h-4 px-1.5 font-normal"
            >
              {typeLabel}
            </Badge>
          ) : null}
        </FactItem>
        <FactItem label="Estado" icon={<FlagIcon className="size-3.5" />}>
          <Badge variant={projectStatusVariant(snapshot.projectStatus)}>
            {statusLabel}
          </Badge>
        </FactItem>
        <FactItem
          label="Responsable"
          icon={<UserRoundIcon className="size-3.5" />}
        >
          <p className="text-sm font-medium">{owner}</p>
        </FactItem>
        <FactItem
          label="Riesgo"
          icon={<ShieldAlertIcon className="size-3.5" />}
        >
          <Badge variant={riskLevelVariant(snapshot.riskLevel)}>
            {riskLevelLabel(snapshot.riskLevel)} (
            {snapshot.contingencyMarginPercentage}%)
          </Badge>
        </FactItem>
        <FactItem
          label="Horas de esfuerzo"
          icon={<Clock3Icon className="size-3.5" />}
        >
          <p className="text-sm font-medium">{snapshot.totalEffortHours} h</p>
        </FactItem>
        <FactItem
          label="Tareas con horas"
          icon={<ListTodoIcon className="size-3.5" />}
        >
          <p className="text-sm font-medium">
            {snapshot.tasksWithHours} / {snapshot.tasksTotal}
          </p>
        </FactItem>
        <FactItem
          label="Costo base"
          icon={<BanknoteIcon className="size-3.5" />}
        >
          <p className="text-sm font-medium">
            {formatCurrency(snapshot.baseCost)}
          </p>
        </FactItem>
        <FactItem
          label="Tiempo base"
          icon={<CalendarDaysIcon className="size-3.5" />}
        >
          <p className="text-sm font-medium">
            {snapshot.baseTime} {unit}
          </p>
        </FactItem>
      </CardContent>
    </Card>
  )
}
