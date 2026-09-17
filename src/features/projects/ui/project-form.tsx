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
import { DateRangeFields } from "@/components/ui/date-range-fields"
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
      <fieldset
        disabled={fieldsLocked}
        className="flex flex-col gap-5 border-0 p-0 disabled:opacity-70"
      >
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
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  maxLength={500}
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

        <form.Field name="tipo">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>
                Tipo de proyecto <span className="text-destructive">*</span>
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

        <form.Field name="fecha_inicio">
          {(startField) => (
            <form.Field name="fecha_fin">
              {(endField) => (
                <DateRangeFields
                  startId={startField.name}
                  endId={endField.name}
                  startLabel="Fecha prevista de inicio"
                  endLabel="Fecha prevista de entrega"
                  startValue={startField.state.value}
                  endValue={endField.state.value}
                  startError={getFieldError(startField.state.meta.errors)}
                  endError={getFieldError(endField.state.meta.errors)}
                  onStartSelect={startField.handleChange}
                  onEndSelect={endField.handleChange}
                />
              )}
            </form.Field>
          )}
        </form.Field>

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
                  {field.state.value ? (
                    (() => {
                      const selected = usersData?.userResponse.find(
                        (user) => getFullName(user) === field.state.value
                      )
                      return selected ? (
                        <div className="flex items-center gap-2">
                          <UserRound className="text-muted-foreground h-4 w-4" />
                          <span>
                            {getFullName(selected)} - {`(${selected.email})`}
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
      </fieldset>

      {isEditing && (
        <div className="mt-2 border-t pt-4">
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
              </div>
            )}
          </form.Field>
        </div>
      )}

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
