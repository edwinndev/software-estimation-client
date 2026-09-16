"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  Bot,
  Cpu,
  Layers,
  Pen,
  Sliders,
  Trash,
  TrendingUp,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/format"
import type { Project } from "../types/project-types"
import { ProjectDeleteDialog } from "./project-delete-dialog"
import { ProjectEditDialog } from "./project-edit-dialog"

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
  const router = useRouter()
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const estadoInfo = getEstadoInfo(project.estado)
          const TipoIcon = TIPO_ICONS[project.tipo as keyof typeof TIPO_ICONS]

          return (
            <TableRow
              key={project.id}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <TableCell>
                <input
                  type="checkbox"
                  aria-label={`Ver información general de ${project.nombre}`}
                  className="accent-primary size-4 cursor-pointer"
                  onChange={() => router.push(`/projects/${project.id}`)}
                  onClick={(event) => event.stopPropagation()}
                />
              </TableCell>
              <TableCell className="font-medium">{project.nombre}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {TipoIcon ? (
                    <TipoIcon className="text-muted-foreground size-4" />
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
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar ${project.nombre}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setEditingProject(project)
                    }}
                  >
                    <Pen />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Eliminar ${project.nombre}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setDeletingProject(project)
                    }}
                  >
                    <Trash className="text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <ProjectDeleteDialog
        isOpen={deletingProject !== null}
        projectId={deletingProject?.id ?? null}
        projectName={deletingProject?.nombre}
        onClose={() => setDeletingProject(null)}
        onSuccess={() => setDeletingProject(null)}
      />
      <ProjectEditDialog
        isOpen={editingProject !== null}
        project={editingProject}
        onClose={() => setEditingProject(null)}
      />
    </Table>
  )
}
