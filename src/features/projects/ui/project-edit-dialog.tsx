"use client"

import { useEffect } from "react"
import { useForm } from "@tanstack/react-form"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  Loader2,
  Code,
  Briefcase,
  Wrench,
  FlaskConical,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { projectEditSchema } from "../schemas/project-schema"
import { useProjects } from "../hooks/use-projects"
import type { Project } from "../types/project-types"

const TIPOS_PROYECTO = [
  { value: "desarrollo", label: "Desarrollo", icon: Code },
  { value: "consultoria", label: "Consultoría", icon: Briefcase },
  { value: "mantenimiento", label: "Mantenimiento", icon: Wrench },
  { value: "investigacion", label: "Investigación", icon: FlaskConical },
] as const

const RESPONSABLES = [
  { value: "Ana Torres", label: "Ana Torres" },
  { value: "Luis Fernández", label: "Luis Fernández" },
  { value: "María Gómez", label: "María Gómez" },
] as const

const ESTADOS_PROYECTO = [
  { value: "borrador", label: "Borrador" },
  { value: "en_evaluacion", label: "En evaluación" },
  { value: "estimado", label: "Estimado" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "en_ejecucion", label: "En ejecución" },
  { value: "finalizado", label: "Finalizado" },
] as const

interface ProjectEditDialogProps {
  isOpen: boolean
  project: Project | null
  onClose: () => void
}

export const ProjectEditDialog = ({
  isOpen,
  project,
  onClose,
}: ProjectEditDialogProps) => {
  const { updateProject, isUpdating } = useProjects()

  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipo: "",
      fecha_inicio: undefined as Date | undefined,
      fecha_fin: undefined as Date | undefined,
      responsable: "",
      estado: "borrador",
    },
    validators: {
      onSubmit: projectEditSchema,
    },
    onSubmit: async ({ value }) => {
      if (!project) return
      try {
        await updateProject({
          id: project.id,
          data: { ...value, estado: value.estado },
        })
        onClose()
      } catch (error) {
        console.error("Error updating project:", error)
      }
    },
  })

  useEffect(() => {
    if (project && isOpen) {
      form.reset()
      form.setFieldValue("nombre", project.nombre)
      form.setFieldValue("descripcion", project.descripcion)
      form.setFieldValue("tipo", project.tipo)
      form.setFieldValue("fecha_inicio", new Date(project.fecha_inicio))
      form.setFieldValue("fecha_fin", new Date(project.fecha_fin))
      form.setFieldValue("responsable", project.responsable)
      form.setFieldValue("estado", project.estado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            {project
              ? `Modifica los detalles de ${project.nombre}`
              : "Cargando..."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="nombre">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-${field.name}`}>
                  Nombre del proyecto{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`edit-${field.name}`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ingresa el nombre del proyecto"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-${field.name}`}>Descripción</Label>
                <Textarea
                  id={`edit-${field.name}`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  maxLength={500}
                  placeholder="Ingresa una descripción del proyecto (opcional)"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <div className="flex items-center justify-between">
                  {field.state.meta.errors.length > 0 ? (
                    <p className="text-destructive text-xs">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-muted-foreground text-xs">
                    {field.state.value?.length ?? 0}/500
                  </p>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="tipo">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-${field.name}`}>
                  Tipo de proyecto <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger id={`edit-${field.name}`} className="w-full">
                    {field.state.value ? (
                      (() => {
                        const selected = TIPOS_PROYECTO.find(
                          (t) => t.value === field.state.value
                        )
                        return selected ? (
                          <div className="flex items-center gap-2">
                            <selected.icon className="text-muted-foreground h-4 w-4" />
                            <span>{selected.label}</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Selecciona el tipo de proyecto" />
                        )
                      })()
                    ) : (
                      <SelectValue placeholder="Selecciona el tipo de proyecto" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PROYECTO.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div className="flex items-center gap-2">
                          <tipo.icon className="text-muted-foreground h-4 w-4" />
                          <span>{tipo.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field name="fecha_inicio">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`edit-${field.name}`}>
                    Fecha de inicio <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          id={`edit-${field.name}`}
                          variant="outline"
                          data-empty={!field.state.value}
                          aria-invalid={field.state.meta.errors.length > 0}
                          className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
                        />
                      }
                    >
                      {field.state.value ? (
                        format(field.state.value, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => {
                          if (date) field.handleChange(date)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-xs">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="fecha_fin">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`edit-${field.name}`}>
                    Fecha de entrega <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          id={`edit-${field.name}`}
                          variant="outline"
                          data-empty={!field.state.value}
                          aria-invalid={field.state.meta.errors.length > 0}
                          className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
                        />
                      }
                    >
                      {field.state.value ? (
                        format(field.state.value, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => {
                          if (date) field.handleChange(date)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-xs">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="responsable">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-${field.name}`}>
                  Responsable del proyecto{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger id={`edit-${field.name}`} className="w-full">
                    <SelectValue placeholder="Selecciona un responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSABLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="border-t pt-4">
            <form.Field name="estado">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`edit-${field.name}`}>
                    Estado del proyecto{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger id={`edit-${field.name}`} className="w-full">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_PROYECTO.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting || isUpdating}>
                  {isSubmitting || isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Guardar Cambios
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
