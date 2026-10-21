"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"

import {
  SaveIcon,
  XIcon,
  Loader2,
  Cpu,
  Bot,
  Activity,
  Sliders,
  TrendingUp,
  Layers,
  UserRound,
  FileText,
  Eye,
  Calculator,
  CheckCircle,
  XCircle,
  PlayCircle,
  Flag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker"
import { DescriptionHint } from "@/components/ui/description-hint"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { cn } from "@/lib/utils"
import { projectSchema } from "../schemas/project-schema"
import { useProjectAccess } from "../hooks/use-project-access"
import { useProjects } from "../hooks/use-projects"
import { isProjectStatus } from "../types/project-status"
import { useUsers } from "@/features/users/hooks/use-users"
import { getFullName } from "@/features/auth/types"
import type { Project } from "../types/project-types"

const TIPOS_PROYECTO = [
  {
    value: "monitoreo",
    label: "Monitoreo IoT",
    icon: Cpu,
    color: "text-blue-500",
  },
  {
    value: "automatizacion",
    label: "Automatización IoT",
    icon: Bot,
    color: "text-emerald-500",
  },
  {
    value: "telemetria",
    label: "Telemetría IoT",
    icon: Activity,
    color: "text-amber-500",
  },
  {
    value: "control_supervision",
    label: "Control y supervisión IoT",
    icon: Sliders,
    color: "text-purple-500",
  },
  {
    value: "mantenimiento_predictivo",
    label: "Mantenimiento predictivo IoT",
    icon: TrendingUp,
    color: "text-rose-500",
  },
  {
    value: "integracion",
    label: "Integración IoT",
    icon: Layers,
    color: "text-cyan-500",
  },
] as const

const ESTADOS_PROYECTO = [
  {
    value: "borrador",
    label: "Borrador",
    icon: FileText,
    color: "text-muted-foreground",
  },
  {
    value: "en_evaluacion",
    label: "En evaluación",
    icon: Eye,
    color: "text-amber-500",
  },
  {
    value: "estimado",
    label: "Estimado",
    icon: Calculator,
    color: "text-blue-500",
  },
  {
    value: "aprobado",
    label: "Aprobado",
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  {
    value: "rechazado",
    label: "Rechazado",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    value: "en_ejecucion",
    label: "En ejecución",
    icon: PlayCircle,
    color: "text-cyan-500",
  },
  {
    value: "finalizado",
    label: "Finalizado",
    icon: Flag,
    color: "text-purple-500",
  },
] as const

type ProjectFormProps = {
  project: Project | null
}

export const ProjectForm = ({ project }: ProjectFormProps) => {
  const router = useRouter()
  const { createProject, updateProject, isCreating, isUpdating } = useProjects()
  const access = useProjectAccess(project ? project.id : "")
  const fieldsLocked = Boolean(project) && !access.canEditGeneral
  const canChangeStatus = access.allowedTransitions.length > 0
  const canSave = !project || access.canEditGeneral || canChangeStatus
  const statusOptions = ESTADOS_PROYECTO.filter((item) => {
    if (!project) {
      return item.value === "borrador"
    }
    if (item.value === project.estado) {
      return true
    }
    return (
      isProjectStatus(item.value) &&
      access.allowedTransitions.includes(item.value)
    )
  })
  const { data: usersData } = useUsers({
    filters: [],
    pagination: {
      orderBy: "createdAt",
      pageSize: 1000,
      pageNumber: 0,
      sortDirection: "ASC",
    },
  })

  const isEditing = Boolean(project)
  const isPending = isCreating || isUpdating

  const form = useForm({
    defaultValues: {
      nombre: project ? project.nombre : "",
      descripcion: project ? project.descripcion : "",
      tipo: project ? project.tipo : "",
      fecha_inicio: project
        ? new Date(project.fecha_inicio)
        : (undefined as Date | undefined),
      fecha_fin: project
        ? new Date(project.fecha_fin)
        : (undefined as Date | undefined),
      responsable: project ? project.responsable : "",
      estado: project ? project.estado : "borrador",
    },
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (project) {
          await updateProject({
            id: project.id,
            data: { ...value, estado: value.estado },
          })
          toast.add({
            title: "Proyecto actualizado",
            description: `Los datos de ${value.nombre} se guardaron correctamente.`,
            type: "success",
          })
        } else {
          await createProject(value)
          toast.add({
            title: "Proyecto creado",
            description: `${value.nombre} se registró correctamente.`,
            type: "success",
          })
        }
        router.push("/projects")
      } catch (error) {
        toast.add({
          title: "No se pudo guardar el proyecto",
          description: getErrorMessage(error, "Inténtalo de nuevo."),
          type: "error",
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex w-full flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Row 1 - Col 1: Nombre */}
        <form.Field name="nombre">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>
                Nombre del proyecto <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                disabled={fieldsLocked}
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

        {/* Row 1 - Col 2: Tipo */}
        <form.Field name="tipo">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>
                Tipo de proyecto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={field.state.value}
                disabled={fieldsLocked}
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
                          <selected.icon
                            className={cn("h-4 w-4", selected.color)}
                          />
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
                        <tipo.icon className={cn("h-4 w-4", tipo.color)} />
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

        {/* Row 1 - Col 3: Responsable */}
        <form.Field name="responsable">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>
                Responsable del proyecto{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={field.state.value}
                disabled={fieldsLocked}
                onValueChange={(value) => field.handleChange(value ?? "")}
              >
                <SelectTrigger id={field.name} className="w-full">
                  {field.state.value ? (
                    (() => {
                      const selected = usersData?.userResponse.find(
                        (user) => getFullName(user) === field.state.value
                      )
                      return selected ? (
                        <div className="flex items-center gap-2">
                          <UserRound className="text-muted-foreground h-4 w-4" />
                          <span className="truncate">
                            {getFullName(selected)}
                          </span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecciona un responsable" />
                      )
                    })()
                  ) : (
                    <SelectValue placeholder="Selecciona un responsable" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {usersData?.userResponse.map((user) => (
                    <SelectItem key={user.id} value={getFullName(user)}>
                      <div className="flex items-center gap-2">
                        <UserRound className="text-muted-foreground h-4 w-4" />
                        <span>
                          {getFullName(user)} - {`(${user.email})`}
                        </span>
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

        {/* Row 2 - Col 1: Fecha prevista de inicio */}
        <form.Field name="fecha_inicio">
          {(startField) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={startField.name}>
                Fecha prevista de inicio{" "}
                <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id={startField.name}
                value={startField.state.value}
                disabled={fieldsLocked}
                maxDate={form.getFieldValue("fecha_fin")}
                invalid={Boolean(getFieldError(startField.state.meta.errors))}
                placeholder="Selecciona fecha de inicio"
                onSelect={startField.handleChange}
              />
              {startField.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {startField.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Row 2 - Col 2: Fecha prevista de entrega */}
        <form.Field name="fecha_fin">
          {(endField) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={endField.name}>
                Fecha prevista de entrega{" "}
                <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id={endField.name}
                value={endField.state.value}
                disabled={fieldsLocked}
                minDate={form.getFieldValue("fecha_inicio")}
                invalid={Boolean(getFieldError(endField.state.meta.errors))}
                placeholder="Selecciona fecha de entrega"
                onSelect={endField.handleChange}
              />
              {endField.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {endField.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Row 2 - Col 3: Estado del proyecto */}
        {isEditing ? (
          <form.Field name="estado">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>
                  Estado del proyecto{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  disabled={!canChangeStatus}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    {field.state.value ? (
                      (() => {
                        const selected = ESTADOS_PROYECTO.find(
                          (e) => e.value === field.state.value
                        )
                        return selected ? (
                          <div className="flex items-center gap-2">
                            <selected.icon
                              className={cn("h-4 w-4", selected.color)}
                            />
                            <span>{selected.label}</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Selecciona el estado" />
                        )
                      })()
                    ) : (
                      <SelectValue placeholder="Selecciona el estado" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        <div className="flex items-center gap-2">
                          <estado.icon
                            className={cn("h-4 w-4", estado.color)}
                          />
                          <span>{estado.label}</span>
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
        ) : (
          <div className="flex flex-col gap-1.5 opacity-80">
            <Label>Estado inicial</Label>
            <div className="border-input bg-muted text-muted-foreground flex h-9 w-full items-center gap-2 rounded-md border px-3 text-sm">
              <FileText className="h-4 w-4 text-amber-500" />
              <span>Borrador (predeterminado)</span>
            </div>
          </div>
        )}

        {/* Row 3 - Full Width: Descripción */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <form.Field
            name="descripcion"
            validators={{
              onChange: projectSchema.shape.descripcion,
              onBlur: projectSchema.shape.descripcion,
            }}
          >
            {(field) => {
              const error = getFieldError(field.state.meta.errors)
              const length = field.state.value.trim().length

              return (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Descripción</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    disabled={fieldsLocked}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Ingresa una descripción del proyecto (opcional)"
                    aria-invalid={Boolean(error)}
                  />
                  <DescriptionHint
                    error={error}
                    hint="Opcional. Si la escribes, usa al menos 10 caracteres (máx. 500)."
                    length={length}
                    limit={500}
                    invalidCount={length > 0 && length < 10}
                  />
                </div>
              )
            }}
          </form.Field>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.push("/projects")}
        >
          <XIcon className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        {canSave ? (
          <FormSubmitButton
            form={form}
            schema={projectSchema}
            isPending={isPending}
          >
            {({ isBusy }) => (
              <>
                {isBusy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SaveIcon className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Guardar Cambios" : "Guardar Proyecto"}
              </>
            )}
          </FormSubmitButton>
        ) : null}
      </div>
    </form>
  )
}
