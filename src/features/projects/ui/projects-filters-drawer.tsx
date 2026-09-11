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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
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

const emptyFilters: ProjectFilters = {
  nombre: "",
  tipo: "",
  responsable: "",
  estado: "",
}

const projectTypes = [
  {
    value: "monitoreo",
    label: "Monitoreo IoT",
    icon: Cpu,
  },
  {
    value: "automatizacion",
    label: "Automatización IoT",
    icon: Bot,
  },
  { value: "telemetria", label: "Telemetría IoT", icon: Activity },
  {
    value: "control_supervision",
    label: "Control y supervisión IoT",
    icon: Sliders,
  },
  {
    value: "mantenimiento_predictivo",
    label: "Mantenimiento predictivo IoT",
    icon: TrendingUp,
  },
  { value: "integracion", label: "Integración IoT", icon: Layers },
]

const projectStatuses = [
  { value: "borrador", label: "Borrador" },
  { value: "en_evaluacion", label: "En evaluación" },
  { value: "estimado", label: "Estimado" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "en_ejecucion", label: "En ejecución" },
  { value: "finalizado", label: "Finalizado" },
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
      })
      onOpenChange(false)
    },
  })

  const renderSelect = (
    name: "tipo" | "responsable" | "estado",
    label: string,
    options: { value: string; label: string }[]
  ) => (
    <form.Field name={name}>
      {(field) => (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`projects-filter-${name}`}>{label}</Label>
          <Select
            value={field.state.value}
            onValueChange={(value) => field.handleChange(String(value))}
          >
            <SelectTrigger id={`projects-filter-${name}`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PROJECT_FILTER_VALUE}>
                {name === "responsable" && (
                  <UserRound className="text-muted-foreground h-4 w-4" />
                )}
                <span>Todos</span>
              </SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {name === "responsable" && (
                    <UserRound className="text-muted-foreground h-4 w-4" />
                  )}
                  <span>{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </form.Field>
  )

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

            return { value: fullName, label: `${fullName} {${user.email}}` }
          })
        )}
        {renderSelect("estado", "Estado", projectStatuses)}
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
        <Button type="submit" className="flex-1">
          <CheckIcon />
          Aplicar filtros
        </Button>
      </DrawerFooter>
    </form>
  )
}

export const ProjectsFiltersDrawer = ({
  open,
  filters,
  onOpenChange,
  onApply,
}: ProjectsFiltersDrawerProps) => (
  <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
    <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:88%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]">
      {open ? (
        <ProjectsFiltersForm
          key={`${filters.nombre}|${filters.tipo}|${filters.responsable}|${filters.estado}`}
          filters={filters}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      ) : null}
    </DrawerContent>
  </Drawer>
)
