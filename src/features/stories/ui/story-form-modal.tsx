"use client"

import { useForm } from "@tanstack/react-form"
import { SaveIcon, UserRound, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DescriptionHint } from "@/components/ui/description-hint"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getFieldError } from "@/lib/form-errors"
import { cn } from "@/lib/utils"
import type { TechnicalProfile } from "../types/story-types"
import { TaskProfileInfo } from "./task-profile-info"
import {
  storySchema,
  taskSchema,
  type StoryFormValues,
  type TaskFormValues,
} from "../schemas/story-schema"
import {
  findOption,
  PROFILE_OPTIONS,
  STORY_PRIORITY_OPTIONS,
  STORY_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
  type SelectOption,
} from "./story-options"

type StoryFormProps = {
  initial: StoryFormValues | null
  onSubmit: (values: StoryFormValues) => void
  onCancel: () => void
}

type TaskFormProps = {
  profiles: TechnicalProfile[]
  initial: TaskFormValues | null
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
}

const RequiredMark = () => <span className="text-destructive">*</span>

const FieldError = ({ error }: { error: string }) =>
  error ? <p className="text-destructive text-xs">{error}</p> : null

const IconSelect = <TValue extends string>({
  id,
  value,
  placeholder,
  options,
  onChange,
}: {
  id: string
  value: string
  placeholder: string
  options: SelectOption<TValue>[]
  onChange: (value: TValue) => void
}) => {
  const selected = findOption(options, value)

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        const option = findOption(options, nextValue ?? "")
        if (option) {
          onChange(option.value)
        }
      }}
    >
      <SelectTrigger id={id} className="w-full">
        {selected ? (
          <div className="flex items-center gap-2">
            <selected.icon className={cn("h-4 w-4", selected.color)} />
            <span>{selected.label}</span>
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const Icon = option.icon
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", option.color)} />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export const StoryForm = ({ initial, onSubmit, onCancel }: StoryFormProps) => {
  const form = useForm({
    defaultValues: initial ?? {
      title: "",
      description: "",
      priority: "medium" as const,
      status: "draft" as const,
    },
    validators: {
      onSubmit: storySchema,
    },
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="story-title">
              Título <RequiredMark />
            </Label>
            <Input
              id="story-title"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError error={getFieldError(field.state.meta.errors)} />
          </div>
        )}
      </form.Field>
      <form.Field
        name="description"
        validators={{
          onChange: storySchema.shape.description,
          onBlur: storySchema.shape.description,
        }}
      >
        {(field) => {
          const error = getFieldError(field.state.meta.errors)
          const length = field.state.value.trim().length

          return (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-description">
                Descripción <RequiredMark />
              </Label>
              <Textarea
                id="story-description"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
              />
              <DescriptionHint
                error={error}
                hint="Describe la necesidad con al menos 10 caracteres."
                length={length}
                limit={10}
                invalidCount={length < 10}
              />
            </div>
          )
        }}
      </form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="priority">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-priority">
                Prioridad <RequiredMark />
              </Label>
              <IconSelect
                id="story-priority"
                value={field.state.value}
                placeholder="Selecciona una prioridad"
                options={STORY_PRIORITY_OPTIONS}
                onChange={field.handleChange}
              />
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-status">
                Estado <RequiredMark />
              </Label>
              <IconSelect
                id="story-status"
                value={field.state.value}
                placeholder="Selecciona un estado"
                options={STORY_STATUS_OPTIONS}
                onChange={field.handleChange}
              />
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )}
        </form.Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XIcon />
          Cancelar
        </Button>
        <FormSubmitButton form={form} schema={storySchema}>
          <SaveIcon />
          Guardar historia
        </FormSubmitButton>
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
  const form = useForm({
    defaultValues: initial ?? {
      title: "",
      description: "",
      estimate: 0,
      status: "todo" as const,
      profileIds: [],
    },
    validators: {
      onSubmit: taskSchema,
    },
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">
              Título <RequiredMark />
            </Label>
            <Input
              id="task-title"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError error={getFieldError(field.state.meta.errors)} />
          </div>
        )}
      </form.Field>
      <form.Field
        name="description"
        validators={{
          onChange: taskSchema.shape.description,
          onBlur: taskSchema.shape.description,
        }}
      >
        {(field) => {
          const error = getFieldError(field.state.meta.errors)
          const length = field.state.value.trim().length

          return (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-description">
                Descripción <RequiredMark />
              </Label>
              <Textarea
                id="task-description"
                rows={3}
                className="max-h-24 min-h-16"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
              />
              <DescriptionHint
                error={error}
                hint="Describe la tarea con al menos 10 caracteres."
                length={length}
                limit={10}
                invalidCount={length < 10}
              />
            </div>
          )
        }}
      </form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="estimate">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-estimate">
                Horas estimadas <RequiredMark />
              </Label>
              <NumberInput
                id="task-estimate"
                value={field.state.value}
                min={0}
                max={9999}
                step={1}
                disabled={false}
                invalid={Boolean(getFieldError(field.state.meta.errors))}
                className=""
                onBlur={field.handleBlur}
                onChange={field.handleChange}
              />
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-status">
                Estado <RequiredMark />
              </Label>
              <IconSelect
                id="task-status"
                value={field.state.value}
                placeholder="Selecciona un estado"
                options={TASK_STATUS_OPTIONS}
                onChange={field.handleChange}
              />
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )}
        </form.Field>
      </div>
      <form.Field name="profileIds">
        {(field) => {
          const assignableProfiles = profiles.filter(
            (profile) => profile.isActive
          )

          return (
            <div className="flex flex-col gap-1.5">
              <Label>
                Perfil técnico <RequiredMark />
              </Label>
              {assignableProfiles.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No hay perfiles activos. Créalos en Gestión de perfiles
                  técnicos y CER.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {assignableProfiles.map((profile) => {
                    const option = findOption(PROFILE_OPTIONS, profile.role)
                    const Icon = option?.icon ?? UserRound
                    const color = option?.color ?? "text-muted-foreground"
                    const selected = field.state.value.includes(profile.id)
                    const checkboxId = `task-profile-${profile.id}`
                    const roleLabel = option?.label ?? profile.role

                    return (
                      <label
                        key={profile.id}
                        htmlFor={checkboxId}
                        className={cn(
                          "flex cursor-pointer items-start gap-2 rounded-md border px-2 py-2 text-sm",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-input bg-background"
                        )}
                      >
                        <Checkbox
                          id={checkboxId}
                          checked={selected}
                          onCheckedChange={(checked) =>
                            field.handleChange(
                              checked === true
                                ? [...field.state.value, profile.id]
                                : field.state.value.filter(
                                    (id) => id !== profile.id
                                  )
                            )
                          }
                        />
                        <TaskProfileInfo
                          name={profile.name}
                          roleLabel={roleLabel}
                          email={profile.email}
                          hourlyRate={profile.hourlyRate}
                          icon={Icon}
                          color={color}
                        />
                      </label>
                    )
                  })}
                </div>
              )}
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )
        }}
      </form.Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XIcon />
          Cancelar
        </Button>
        <FormSubmitButton form={form} schema={taskSchema}>
          <SaveIcon />
          Guardar tarea
        </FormSubmitButton>
      </div>
    </form>
  )
}
