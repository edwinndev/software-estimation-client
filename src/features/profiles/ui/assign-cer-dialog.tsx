"use client"

import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { SaveIcon, XIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useUpdateProfile } from "../hooks"
import type { Profile } from "../types"

const cerSchema = z.object({
  hourlyRate: z
    .number({ message: "El costo horario (CER) debe ser un número válido." })
    .positive({ message: "El costo horario (CER) debe ser mayor a 0." }),
  currency: z.literal("PEN"),
})

type AssignCerDialogProps = {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AssignCerDialog = ({
  profile,
  open,
  onOpenChange,
}: AssignCerDialogProps) => {
  const updateMutation = useUpdateProfile()

  const form = useForm({
    defaultValues: {
      hourlyRate: profile?.hourlyRate ?? 0,
      currency: "PEN",
    },
    onSubmit: async ({ value }) => {
      if (!profile) return
      try {
        await updateMutation.mutateAsync({
          id: profile.id,
          hourlyRate: value.hourlyRate,
          currency: "PEN",
        })
        toast.add({
          title: "CER actualizado",
          description: `El CER de ${profile.name} se guardó correctamente.`,
          type: "success",
        })
        onOpenChange(false)
      } catch (error) {
        toast.add({
          title: "No se pudo actualizar el CER",
          description: getErrorMessage(error, "Inténtalo de nuevo."),
          type: "error",
        })
      }
    },
  })

  if (!profile || !open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Costo Estándar (CER)</DialogTitle>
          <DialogDescription>
            Define o ajusta la tarifa por hora (CER) para este perfil técnico en
            las estimaciones de proyectos.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 flex items-center justify-between rounded-md border p-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{profile.name}</span>
            <span className="text-muted-foreground text-xs">
              {profile.role}
            </span>
          </div>
          <Badge variant="secondary">{profile.experienceLevel}</Badge>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4 pt-1"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <form.Field
              name="hourlyRate"
              validators={{
                onChange: ({ value }) => {
                  const res = cerSchema.shape.hourlyRate.safeParse(value)
                  return res.success ? undefined : res.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Costo estándar / hora</Label>
                  <NumberInput
                    id={field.name}
                    value={field.state.value}
                    min={0}
                    max={9999}
                    step={0.5}
                    disabled={updateMutation.isPending}
                    invalid={Boolean(getFieldError(field.state.meta.errors))}
                    className=""
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                  {getFieldError(field.state.meta.errors) ? (
                    <p className="text-destructive text-xs">
                      {getFieldError(field.state.meta.errors)}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="currency">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Moneda</Label>
                  <Select value="PEN" disabled>
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="PEN (S/)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PEN">PEN (S/)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              <XIcon />
              Cancelar
            </Button>
            <FormSubmitButton
              form={form}
              schema={cerSchema}
              isPending={updateMutation.isPending}
            >
              {({ isBusy }) => (
                <>
                  <SaveIcon />
                  {isBusy ? "Asignando..." : "Asignar CER"}
                </>
              )}
            </FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
