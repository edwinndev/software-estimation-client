"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { storySchema, type StoryFormValues } from "../schemas/stories-schema"

interface StoryFormModalProps {
  open: boolean
  initial?: StoryFormValues
  onOpenChange: (open: boolean) => void
  onSubmit: (values: StoryFormValues) => void
}

export const StoryFormModal = ({
  open,
  initial,
  onOpenChange,
  onSubmit,
}: StoryFormModalProps) => {
  const form = useForm({
    defaultValues: initial ?? {
      title: "",
      description: "",
      priority: "medium",
      status: "draft",
    },
    onSubmit: ({ value }) => {
      const result = storySchema.safeParse(value)
      if (result.success) onSubmit(result.data)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? "Editar historia" : "Nueva historia de usuario"}
          </DialogTitle>
          <DialogDescription>
            Registra la necesidad y su prioridad dentro del alcance.
          </DialogDescription>
        </DialogHeader>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar historia</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
