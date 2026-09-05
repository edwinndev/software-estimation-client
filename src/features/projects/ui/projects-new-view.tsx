"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  SaveIcon,
  XIcon,
  Loader2,
  MoveLeft,
  Code,
  Briefcase,
  Wrench,
  FlaskConical,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

import { projectSchema } from "../schemas/project-schema"
import { useProjects } from "../hooks/use-projects"
import { ProjectCreatedModal } from "./project-created-modal"
import { Project } from "../types/project-types"

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

export const ProjectsNewView = () => {
  const router = useRouter()
  const { createProject, isCreating } = useProjects()
  const [createdProject, setCreatedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipo: "",
      fecha_inicio: undefined as Date | undefined,
      fecha_fin: undefined as Date | undefined,
      responsable: "",
    },
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const project = await createProject(value)
        setCreatedProject(project)
        setModalOpen(true)
      } catch (error) {
        console.error("Error creating project:", error)
      }
    },
  })

  const handleGoToProjects = () => {
    setModalOpen(false)
    router.push("/projects")
  }

  const handleCreateAnother = () => {
    setModalOpen(false)
    setCreatedProject(null)
    form.reset()
  }

  return (
    <>
      <ProjectCreatedModal
        open={modalOpen}
        project={createdProject}
        onGoToProjects={handleGoToProjects}
        onCreateAnother={handleCreateAnother}
      />
      <div className="mx-auto flex max-w-full flex-col items-center gap-6">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Nuevo proyecto
            </h1>
            <p className="text-muted-foreground text-sm">
              Registra un nuevo proyecto con estado inicial borrador.
            </p>
          </div>
          <Link
            href="/projects"
            className={buttonVariants({ variant: "outline" })}
          >
            <MoveLeft />
            Volver a proyectos
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex w-full flex-col"
        >
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <form.Field name="nombre">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>
                      Nombre del proyecto{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={field.name}
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
                    <Label htmlFor={field.name}>Descripción</Label>
                    <Textarea
                      id={field.name}
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
                    <Label htmlFor={field.name}>
                      Tipo de proyecto{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger id={field.name} className="w-full">
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

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <form.Field name="fecha_inicio">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={field.name}>
                        Fecha prevista de inicio{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              id={field.name}
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
                      <Label htmlFor={field.name}>
                        Fecha prevista de entrega{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              id={field.name}
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
                    <Label htmlFor={field.name}>
                      Responsable del proyecto{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger id={field.name} className="w-full">
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
                    <p className="text-muted-foreground text-xs">
                      Solo se muestran usuarios registrados en el sistema
                    </p>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-xs">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Link
              href="/projects"
              className={buttonVariants({ variant: "outline" })}
            >
              <XIcon className="mr-2 h-4 w-4" />
              Cancelar
            </Link>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting || isCreating}>
                  {isSubmitting || isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SaveIcon className="mr-2 h-4 w-4" />
                  )}
                  Guardar Proyecto
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </>
  )
}
