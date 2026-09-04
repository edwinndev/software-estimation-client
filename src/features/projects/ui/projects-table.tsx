"use client"

import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { Project } from "../types/project-types"

interface ProjectsTableProps {
  projects: Project[]
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const estadoInfo = getEstadoInfo(project.estado)

          return (
            <TableRow
              key={project.id}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <TableCell className="font-medium">{project.nombre}</TableCell>
              <TableCell className="capitalize">{project.tipo}</TableCell>
              <TableCell>{project.responsable}</TableCell>
              <TableCell>
                <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
              </TableCell>
              <TableCell>{formatDate(project.fecha_inicio)}</TableCell>
              <TableCell>{formatDate(project.fecha_fin)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
