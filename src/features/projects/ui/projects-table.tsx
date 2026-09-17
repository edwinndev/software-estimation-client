"use client"

import { useState } from "react"
import Link from "next/link"
import { Activity, Bot, Cpu, Layers, Sliders, TrendingUp } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"
import type { Project } from "../types/project-types"
import { ProjectDeleteDialog } from "./project-delete-dialog"
import { ProjectsRowActions } from "./projects-row-actions"

interface ProjectsTableProps {
  projects: Project[]
}

const TIPO_LABELS: Record<string, string> = {
  monitoreo: "Monitoreo IoT",
  automatizacion: "Automatización IoT",
  monitoreo_automatizacion: "Monitoreo y automatización IoT",
  telemetria: "Telemetría IoT",
  control_supervision: "Control y supervisión IoT",
  mantenimiento_predictivo: "Mantenimiento predictivo IoT",
  integracion: "Integración IoT",
  investigacion: "Integración IoT",
}

const TIPO_ICONS = {
  monitoreo: Cpu,
  automatizacion: Bot,
  monitoreo_automatizacion: Bot,
  telemetria: Activity,
  control_supervision: Sliders,
  mantenimiento_predictivo: TrendingUp,
  integracion: Layers,
  investigacion: Layers,
}

const TIPO_COLORS: Record<string, string> = {
  monitoreo: "text-blue-500",
  automatizacion: "text-emerald-500",
  monitoreo_automatizacion: "text-emerald-500",
  telemetria: "text-amber-500",
  control_supervision: "text-purple-500",
  mantenimiento_predictivo: "text-rose-500",
  integracion: "text-cyan-500",
  investigacion: "text-cyan-500",
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

const getEstadoInfo = (estado: string) => {
  switch (estado) {
    case "borrador":
      return { label: "Borrador", variant: "muted" as const }
    case "en_evaluacion":
      return { label: "En evaluación", variant: "warning" as const }
    case "estimado":
      return { label: "Estimado", variant: "info" as const }
    case "aprobado":
      return { label: "Aprobado", variant: "success" as const }
    case "rechazado":
      return { label: "Rechazado", variant: "destructive" as const }
    case "en_ejecucion":
      return { label: "En ejecución", variant: "default" as const }
    case "finalizado":
      return { label: "Finalizado", variant: "secondary" as const }
    default:
      return { label: estado, variant: "default" as const }
  }
}

export const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead className="w-28 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const estadoInfo = getEstadoInfo(project.estado)
          const TipoIcon = TIPO_ICONS[project.tipo as keyof typeof TIPO_ICONS]
          const tipoColor =
            TIPO_COLORS[project.tipo as keyof typeof TIPO_COLORS]

          return (
            <TableRow
              key={project.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {project.nombre}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {TipoIcon ? (
                    <TipoIcon
                      className={cn(
                        "size-4",
                        tipoColor || "text-muted-foreground"
                      )}
                    />
                  ) : null}
                  <span>{TIPO_LABELS[project.tipo] ?? project.tipo}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-xs font-medium text-blue-100">
                      {getInitials(project.responsable)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{project.responsable}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
              </TableCell>
              <TableCell>{formatDate(project.fecha_inicio)}</TableCell>
              <TableCell>{formatDate(project.fecha_fin)}</TableCell>
              <TableCell>
                <ProjectsRowActions
                  project={project}
                  onDelete={setDeletingProject}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <ProjectDeleteDialog
        isOpen={deletingProject !== null}
        projectId={deletingProject ? deletingProject.id : ""}
        projectName={deletingProject ? deletingProject.nombre : ""}
        onClose={() => setDeletingProject(null)}
        onSuccess={() => setDeletingProject(null)}
      />
    </Table>
  )
}
