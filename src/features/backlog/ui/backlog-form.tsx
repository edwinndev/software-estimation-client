"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  FileTextIcon,
  Layers3Icon,
  ListTodoIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { technicalRoles } from "@/features/profiles/schemas/profile-schema"
import { cn } from "@/lib/utils"
import type { TechnicalProfile } from "../types/backlog-types"
import {
  storySchema,
  taskSchema,
  type StoryFormValues,
  type TaskFormValues,
} from "../schemas/backlog-schema"

interface StoryFormProps {
  initial?: StoryFormValues
  onSubmit: (values: StoryFormValues) => void
  onCancel: () => void
}
interface TaskFormProps {
  profiles: TechnicalProfile[]
  initial?: TaskFormValues
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}

const FieldError = ({ error }: { error?: unknown }) =>
  error ? <p className="text-destructive text-xs">{String(error)}</p> : null

const storyPriorityOptions = [
  {
    value: "low",
    label: "Baja",
    icon: ArrowDownIcon,
    className: "text-blue-600",
  },
  {
    value: "medium",
    label: "Media",
    icon: ArrowUpIcon,
    className: "text-amber-600",
  },
  {
    value: "high",
    label: "Alta",
    icon: SparklesIcon,
    className: "text-red-600",
  },
] as const

const storyStatusOptions = [
  {
    value: "draft",
    label: "Borrador",
    icon: FileTextIcon,
    className: "text-slate-600",
  },
  {
    value: "ready",
    label: "Lista",
    icon: CircleDashedIcon,
    className: "text-sky-600",
  },
  {
    value: "in-progress",
    label: "En progreso",
    icon: Clock3Icon,
    className: "text-amber-600",
  },
  {
    value: "done",
    label: "Completada",
    icon: CheckCircle2Icon,
    className: "text-emerald-600",
  },
] as const

const taskStatusOptions = [
  {
    value: "todo",
    label: "Pendiente",
    icon: ListTodoIcon,
    className: "text-slate-600",
  },
  {
    value: "in-progress",
    label: "En progreso",
    icon: Clock3Icon,
    className: "text-amber-600",
  },
  {
    value: "done",
    label: "Completada",
    icon: CheckCircle2Icon,
    className: "text-emerald-600",
  },
] as const

const renderSelectOption = (
  value: string,
  label: string,
  Icon: typeof ArrowDownIcon,
  className?: string
) => (
  <span className="flex items-center gap-2">
    <Icon className={cn("size-4", className)} />
    <span>{label}</span>
  </span>
)

export const StoryForm = ({ initial, onSubmit, onCancel }: StoryFormProps) => {
  const form = useForm({
    defaultValues:
      initial ??
      ({
        title: "",
        description: "",
        priority: "medium",
        status: "draft",
      } as StoryFormValues),
    onSubmit: ({ value }) => {
      const result = storySchema.safeParse(value)
      if (result.success) onSubmit(result.data)
    },
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="title">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="story-title">Título</Label>
            <Input
              id="story-title"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError error={String(field.state.meta.errors[0] ?? "")} />
          </div>
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="story-description">Descripción</Label>
            <Textarea
              id="story-description"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError error={String(field.state.meta.errors[0] ?? "")} />
          </div>
        )}
      </form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="priority">
          {(field) => {
            const selected =
              storyPriorityOptions.find(
                (option) => option.value === field.state.value
              ) ?? storyPriorityOptions[1]

            return (
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as StoryFormValues["priority"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {storyPriorityOptions.map(
                      ({ value, label, icon: Icon, className }) => (
                        <SelectItem key={value} value={value}>
                          {renderSelectOption(value, label, Icon, className)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <selected.icon className={cn("size-4", selected.className)} />
                  <span>{selected.label}</span>
                </div>
              </div>
            )
          }}
        </form.Field>
        <form.Field name="status">
          {(field) => {
            const selected =
              storyStatusOptions.find(
                (option) => option.value === field.state.value
              ) ?? storyStatusOptions[0]

            return (
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as StoryFormValues["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {storyStatusOptions.map(
                      ({ value, label, icon: Icon, className }) => (
                        <SelectItem key={value} value={value}>
                          {renderSelectOption(value, label, Icon, className)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <selected.icon className={cn("size-4", selected.className)} />
                  <span>{selected.label}</span>
                </div>
              </div>
            )
          }}
        </form.Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar historia</Button>
      </div>
    </form>
  )
}

export const TaskForm = ({
  profiles,
  initial,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const roles = technicalRoles.map((role) => ({
    id: role,
    name: role,
    icon: role.includes("UI") || role.includes("UX") ? Layers3Icon : WrenchIcon,
  }))

  const form = useForm({
    defaultValues:
      initial ??
      ({
        title: "",
        description: "",
        estimate: 1,
        status: "todo",
        profileIds: [],
      } as TaskFormValues),
    onSubmit: ({ value }) => {
      const result = taskSchema.safeParse(value)
      if (result.success) onSubmit(result.data)
    },
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="title">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="task-title">Título</Label>
            <Input
              id="task-title"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="task-description">Descripción</Label>
            <Textarea
              id="task-description"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </div>
        )}
      </form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="estimate">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="task-estimate">Horas estimadas</Label>
              <Input
                id="task-estimate"
                type="number"
                min="1"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
              />
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => {
            const selected =
              taskStatusOptions.find(
                (option) => option.value === field.state.value
              ) ?? taskStatusOptions[0]

            return (
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as TaskFormValues["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatusOptions.map(
                      ({ value, label, icon: Icon, className }) => (
                        <SelectItem key={value} value={value}>
                          {renderSelectOption(value, label, Icon, className)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <selected.icon className={cn("size-4", selected.className)} />
                  <span>{selected.label}</span>
                </div>
              </div>
            )
          }}
        </form.Field>
      </div>
      <form.Field name="profileIds">
        {(field) => (
          <div className="grid gap-2">
            <Label>Perfiles técnicos</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {roles.map((profile) => {
                const profileOption = profiles.find(
                  (item) => item.id === profile.id
                )
                const label = profileOption?.name ?? profile.name
                const Icon = profile.icon

                return (
                  <label
                    key={profile.id}
                    className="border-input bg-background flex items-center gap-2 rounded-md border px-2 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={field.state.value.includes(profile.id)}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.checked
                            ? [...field.state.value, profile.id]
                            : field.state.value.filter(
                                (id) => id !== profile.id
                              )
                        )
                      }
                    />
                    <span className="flex items-center gap-2">
                      <Icon className="text-muted-foreground size-4" />
                      {label}
                    </span>
                  </label>
                )
              })}
            </div>
            <FieldError error={String(field.state.meta.errors[0] ?? "")} />
          </div>
        )}
      </form.Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar tarea</Button>
      </div>
    </form>
  )
}
