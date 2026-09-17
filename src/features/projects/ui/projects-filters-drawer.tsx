"use client"

import { useForm } from "@tanstack/react-form"
import {
  CheckIcon,
  RotateCcwIcon,
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ALL_PROJECT_FILTER_VALUE,
  projectFiltersSchema,
} from "../schemas/project-filters-schema"
import type { ProjectFilters } from "../types/project-types"
import { useUsers } from "@/features/users/hooks/use-users"
import { getFullName } from "@/features/auth/types"
import { getFieldError } from "@/lib/form-errors"
import { cn } from "@/lib/utils"

const emptyFilters: ProjectFilters = {
  nombre: "",
  tipo: "",
  responsable: "",
  estado: "",
  fecha_inicio: "",
  fecha_fin: "",
}

const projectTypes = [
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
]

const projectStatuses = [
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
]

type ProjectsFiltersDrawerProps = {
  open: boolean
  filters: ProjectFilters
  onOpenChange: (open: boolean) => void
  onApply: (filters: ProjectFilters) => void
}

const ProjectsFiltersForm = ({
  filters,
  onOpenChange,
  onApply,
}: Omit<ProjectsFiltersDrawerProps, "open">) => {
  const { data: usersData } = useUsers({
    filters: [],
    pagination: {
      orderBy: "createdAt",
      pageSize: 1000,
      pageNumber: 0,
      sortDirection: "ASC",
    },
  })

  const form = useForm({
    defaultValues: {
      ...filters,
      tipo: filters.tipo || ALL_PROJECT_FILTER_VALUE,
      responsable: filters.responsable || ALL_PROJECT_FILTER_VALUE,
      estado: filters.estado || ALL_PROJECT_FILTER_VALUE,
      fecha_inicio: filters.fecha_inicio
        ? new Date(filters.fecha_inicio)
        : (undefined as Date | undefined),
      fecha_fin: filters.fecha_fin
        ? new Date(filters.fecha_fin)
        : (undefined as Date | undefined),
    },
    validators: { onSubmit: projectFiltersSchema },
    onSubmit: ({ value }) => {
      onApply({
        nombre: value.nombre.trim(),
        tipo: value.tipo === ALL_PROJECT_FILTER_VALUE ? "" : value.tipo,
        responsable:
          value.responsable === ALL_PROJECT_FILTER_VALUE
            ? ""
            : value.responsable,
        estado: value.estado === ALL_PROJECT_FILTER_VALUE ? "" : value.estado,
        fecha_inicio: value.fecha_inicio
          ? value.fecha_inicio.toISOString()
          : "",
        fecha_fin: value.fecha_fin ? value.fecha_fin.toISOString() : "",
      })
      onOpenChange(false)
    },
  })

  const renderSelect = (
    name: "tipo" | "responsable" | "estado",
    label: string,
    options: {
      value: string
      label: string
      icon?: React.ElementType
      color?: string
    }[]
  ) => {
    return (
      <form.Field name={name}>
        {(field) => {
          const selectedOption = options.find(
            (opt) => opt.value === field.state.value
          )
          const isAllSelected = field.state.value === ALL_PROJECT_FILTER_VALUE

          return (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`projects-filter-${name}`}>{label}</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(String(value))}
              >
                <SelectTrigger
                  id={`projects-filter-${name}`}
                  className="w-full"
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {isAllSelected && name === "responsable" && (
                        <UserRound className="text-muted-foreground h-4 w-4" />
                      )}
                      {selectedOption?.icon ? (
                        <selectedOption.icon
                          className={cn(
                            "h-4 w-4",
                            selectedOption.color || "text-muted-foreground"
                          )}
                        />
                      ) : null}
                      {isAllSelected ? "Todos" : selectedOption?.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROJECT_FILTER_VALUE}>
                    <span className="flex items-center gap-2">
                      {name === "responsable" && (
                        <UserRound className="text-muted-foreground h-4 w-4" />
                      )}
                      <span>Todos</span>
                    </span>
                  </SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        {option.icon ? (
                          <option.icon
                            className={cn(
                              "h-4 w-4",
                              option.color || "text-muted-foreground"
                            )}
                          />
                        ) : null}
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        }}
      </form.Field>
    )
  }

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <DrawerHeader>
        <DrawerTitle>Filtros</DrawerTitle>
        <DrawerDescription>
          Selecciona los criterios para filtrar.
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <form.Field name="nombre">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="projects-filter-name">Nombre</Label>
              <Input
                id="projects-filter-name"
                value={field.state.value}
                placeholder="Ej. Plataforma web"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
        {renderSelect("tipo", "Tipo", projectTypes)}
        {renderSelect(
          "responsable",
          "Responsable",
          (usersData?.userResponse ?? []).map((user) => {
            const fullName = getFullName(user)

            return {
              value: fullName,
              label: `${fullName} {${user.email}}`,
              icon: UserRound,
            }
          })
        )}
        {renderSelect("estado", "Estado", projectStatuses)}
        <form.Field name="fecha_inicio">
          {(startField) => (
            <form.Field name="fecha_fin">
              {(endField) => (
                <DateRangeFields
                  startId="projects-filter-fecha-inicio"
                  endId="projects-filter-fecha-fin"
                  startLabel="Fecha de inicio"
                  endLabel="Fecha de entrega"
                  required={false}
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
      </div>

      <DrawerFooter className="flex-row">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            onApply(emptyFilters)
            onOpenChange(false)
          }}
        >
          <RotateCcwIcon />
          Limpiar filtros
        </Button>
        <FormSubmitButton
          form={form}
          schema={projectFiltersSchema}
          className="flex-1"
        >
          <CheckIcon />
          Aplicar filtros
        </FormSubmitButton>
      </DrawerFooter>
    </form>
  )
}

export const ProjectsFiltersDrawer = ({
  open,
  filters,
  onOpenChange,
  onApply,
}: ProjectsFiltersDrawerProps) => {
  if (!open) {
    return null
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:88%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]">
        <ProjectsFiltersForm
          key={`${filters.nombre}|${filters.tipo}|${filters.responsable}|${filters.estado}|${filters.fecha_inicio}|${filters.fecha_fin}`}
          filters={filters}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      </DrawerContent>
    </Drawer>
  )
}
