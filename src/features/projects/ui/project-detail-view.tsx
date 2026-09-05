"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Pen,
  Trash,
  ArrowLeft,
  AlignLeft,
  Folder,
  Tag,
  CalendarDays,
  CalendarCheck,
  User,
  TriangleAlert,
  Clock,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/format"
import { useProject } from "../hooks/use-projects"
import { ProjectDeleteDialog } from "./project-delete-dialog"
import { ProjectEditDialog } from "./project-edit-dialog"

interface ProjectDetailViewProps {
  projectId: string
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

const getInitials = (name: string) => {
  if (!name) return ""
  const names = name.split(" ")
  const initials = names
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
  return initials.toUpperCase()
}

export const ProjectDetailView = ({ projectId }: ProjectDetailViewProps) => {
  const router = useRouter()
  const { data: project, isLoading, isError } = useProject(projectId)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-destructive flex items-center gap-2">
          <p>Error al cargar el proyecto o no fue encontrado.</p>
        </div>
        <div>
          <Button variant="outline" onClick={() => router.push("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Button>
        </div>
      </div>
    )
  }

  const estadoInfo = getEstadoInfo(project.estado)

  return (
    <div className="flex flex-col gap-6">
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl">
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Proyectos
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">
            {project.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="font-medium"
            onClick={() => setIsEditing(true)}
          >
            <Pen className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            className="font-medium"
            onClick={() => setIsDeleting(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Detalles Generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                <AlignLeft className="h-4 w-4" />
                Descripción
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                {project.descripcion || "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <Folder className="h-4 w-4" />
                  Tipo
                </div>
                <p className="text-sm font-medium capitalize">{project.tipo}</p>
              </div>
              <div>
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Estado
                </div>
                <Badge variant={estadoInfo.variant} className="font-medium">
                  {estadoInfo.label}
                </Badge>
              </div>
              <div>
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" />
                  Fecha de Inicio
                </div>
                <p className="text-sm">{formatDate(project.fecha_inicio)}</p>
              </div>
              <div>
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <CalendarCheck className="h-4 w-4" />
                  Fecha de Fin
                </div>
                <p className="text-sm">{formatDate(project.fecha_fin)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Gestión y Estimación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-[180px_1fr] items-center">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Responsable
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                    {getInitials(project.responsable)}
                  </div>
                  <span className="text-sm font-semibold">
                    {project.responsable}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[180px_1fr] items-center">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <TriangleAlert className="h-4 w-4" />
                  Nivel de Riesgo
                </div>
                <span className="text-muted-foreground text-sm italic">
                  Por definir
                </span>
              </div>

              <div className="grid grid-cols-[180px_1fr] items-center">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Tiempo Estimado
                </div>
                <span className="text-muted-foreground text-sm italic">
                  Pendiente de estimación
                </span>
              </div>

              <div className="grid grid-cols-[180px_1fr] items-center">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Coins className="h-4 w-4" />
                  Costo Estimado
                </div>
                <span className="text-muted-foreground text-sm italic">
                  Pendiente de estimación
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProjectDeleteDialog
        isOpen={isDeleting}
        projectId={project.id}
        projectName={project.nombre}
        onClose={() => setIsDeleting(false)}
        onSuccess={() => router.push("/projects")}
      />

      <ProjectEditDialog
        isOpen={isEditing}
        project={project}
        onClose={() => setIsEditing(false)}
      />
    </div>
  )
}
