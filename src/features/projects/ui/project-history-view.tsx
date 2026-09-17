"use client"

import { useProject } from "../hooks/use-projects"
// import { useHistory } from "../hooks/use-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, ArrowRight } from "lucide-react"

interface ProjectHistoryViewProps {
  projectId: string
}

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"
  | "muted"
  | "success"
  | "warning"
  | "info"

const getEstadoVariant = (estado: string): BadgeVariant => {
  switch (estado.toLowerCase()) {
    case "borrador":
      return "muted"
    case "en_evaluacion":
      return "warning"
    case "estimado":
      return "info"
    case "aprobado":
      return "success"
    case "rechazado":
    case "cancelado":
      return "destructive"
    case "en_ejecucion":
    case "en_progreso":
      return "default"
    case "finalizado":
    case "completado":
      return "secondary"
    default:
      return "default"
  }
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    borrador: "Borrador",
    en_evaluacion: "En evaluación",
    estimado: "Estimado",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    en_ejecucion: "En ejecución",
    finalizado: "Finalizado",
    en_progreso: "En Progreso",
    completado: "Completado",
    cancelado: "Cancelado",
  }
  return map[status.toLowerCase()] || status
}

export const ProjectHistoryView = ({ projectId }: ProjectHistoryViewProps) => {
  const { data: project, isLoading, error } = useProject(projectId)

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Cargando historial...</div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-destructive text-sm">
        Error al cargar el historial del proyecto.
      </div>
    )
  }

  const history = project.history || []

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-8 text-center">
          No hay registros en el historial para este proyecto.
        </CardContent>
      </Card>
    )
  }

  // Ordenar el historial de más reciente a más antiguo
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="relative ml-3 space-y-8 border-l">
        {sortedHistory.map((entry) => (
          <div key={entry.id} className="relative pl-6">
            <span className="bg-primary ring-background absolute top-1.5 -left-1.5 h-3 w-3 rounded-full ring-4" />

            <Card className="shadow-sm">
              <CardHeader className="space-y-3 py-4">
                <CardTitle className="font-heading text-sm">
                  {entry.previousState
                    ? "Cambio de estado"
                    : "Creación de proyecto"}
                </CardTitle>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    {entry.previousState ? (
                      <>
                        <Badge
                          variant={getEstadoVariant(entry.previousState)}
                          className="font-medium"
                        >
                          {formatStatus(entry.previousState)}
                        </Badge>
                        <ArrowRight className="text-muted-foreground h-4 w-4" />
                        <Badge
                          variant={getEstadoVariant(entry.newState)}
                          className="font-medium"
                        >
                          {formatStatus(entry.newState)}
                        </Badge>
                      </>
                    ) : (
                      <Badge
                        variant={getEstadoVariant(entry.newState)}
                        className="font-medium"
                      >
                        {formatStatus(entry.newState)}
                      </Badge>
                    )}
                  </div>

                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {entry.changedBy.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(entry.changedAt).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
