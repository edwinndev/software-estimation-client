"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
          {(field) => (
            <div className="grid gap-2">
              <Label>Prioridad</Label>
              <select
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as StoryFormValues["priority"]
                  )
                }
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <div className="grid gap-2">
              <Label>Estado</Label>
              <select
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as StoryFormValues["status"]
                  )
                }
              >
                <option value="draft">Borrador</option>
                <option value="ready">Lista</option>
                <option value="in-progress">En progreso</option>
                <option value="done">Completada</option>
              </select>
            </div>
          )}
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
          {(field) => (
            <div className="grid gap-2">
              <Label>Estado</Label>
              <select
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as TaskFormValues["status"]
                  )
                }
              >
                <option value="todo">Pendiente</option>
                <option value="in-progress">En progreso</option>
                <option value="done">Completada</option>
              </select>
            </div>
          )}
        </form.Field>
      </div>
      <form.Field name="profileIds">
        {(field) => (
          <div className="grid gap-2">
            <Label>Perfiles técnicos</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {profiles.map((profile) => (
                <label
                  key={profile.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={field.state.value.includes(profile.id)}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.checked
                          ? [...field.state.value, profile.id]
                          : field.state.value.filter((id) => id !== profile.id)
                      )
                    }
                  />
                  {profile.name}
                </label>
              ))}
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
