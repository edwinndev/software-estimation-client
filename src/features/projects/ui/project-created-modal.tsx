"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CheckCircle2,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArrowRight,
  PlusCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { Project } from "../types/project-types"

const TIPO_LABELS: Record<string, string> = {
  desarrollo: "Desarrollo",
  consultoria: "Consultoría",
  mantenimiento: "Mantenimiento",
  investigacion: "Investigación",
}

interface ProjectCreatedModalProps {
  open: boolean
  project: Project | null
  onGoToProjects: () => void
  onCreateAnother: () => void
}

export const ProjectCreatedModal = ({
  open,
  project,
  onGoToProjects,
  onCreateAnother,
}: ProjectCreatedModalProps) => {
  if (!project) return null

  const fechaInicio = format(new Date(project.fecha_inicio), "PPP", {
    locale: es,
  })
  const fechaFin = format(new Date(project.fecha_fin), "PPP", { locale: es })

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onGoToProjects()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary h-8 w-8" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-lg font-semibold">
                ¡Proyecto creado exitosamente!
              </DialogTitle>
              <DialogDescription>
                El proyecto ha sido registrado con estado{" "}
                <span className="text-foreground font-medium">borrador</span>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-3 px-1">
          <p className="text-foreground text-sm font-semibold">
            {project.nombre}
          </p>

          {project.descripcion && (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {project.descripcion}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 text-xs">
              <TagIcon className="h-3 w-3" />
              {TIPO_LABELS[project.tipo] ?? project.tipo}
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-xs">
              <UserIcon className="h-3 w-3" />
              {project.responsable}
            </Badge>
          </div>

          <div className="bg-muted/50 flex flex-col gap-2 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Inicio
              </span>
              <span className="font-medium">{fechaInicio}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Entrega
              </span>
              <span className="font-medium">{fechaFin}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:flex-row">
          <Button
            id="create-another-project-btn"
            variant="outline"
            className="flex-1"
            onClick={onCreateAnother}
          >
            <PlusCircle className="h-4 w-4" />
            Crear otro
          </Button>
          <Button
            id="go-to-projects-btn"
            className="flex-1"
            onClick={onGoToProjects}
          >
            Ver proyectos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
