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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import { useUpdateProfile } from "../hooks/use-profiles"
import type { Profile } from "../types"

const cerSchema = z.object({
  hourlyRate: z
    .number({ message: "El costo horario (CER) debe ser un número válido." })
    .positive({ message: "El costo horario (CER) debe ser mayor a 0." }),
  currency: z.string().default("USD"),
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
      currency: profile?.currency ?? "USD",
    },
    onSubmit: async ({ value }) => {
      if (!profile) return
      try {
        await updateMutation.mutateAsync({
          id: profile.id,
          hourlyRate: value.hourlyRate,
          currency: value.currency || "USD",
        })
        toast.add({
          title: "CER asignado exitosamente",
          description: `Se asignó el costo de ${value.currency || profile.currency} ${value.hourlyRate.toFixed(2)}/hora a ${profile.name}.`,
          type: "success",
        })
        onOpenChange(false)
      } catch (error) {
        toast.add({
          title: "Error al asignar CER",
          description:
            error instanceof Error
              ? error.message
              : "No se pudo actualizar el costo por hora.",
          type: "error",
        })
      }
    },
  })

  if (!profile) return null

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

        <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
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
                  <div className="relative">
                    <Input
                      id={field.name}
                      type="number"
                      step="0.5"
                      min="1"
                      defaultValue={profile.hourlyRate}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber || 0)
                      }
                      placeholder="Ej. 45"
                      disabled={updateMutation.isPending}
                      autoFocus
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-xs">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : (field.state.meta.errors[0] as { message?: string })
                            ?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="currency">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Moneda</Label>
                  <Select value={field.state.value || "USD"} disabled>
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="USD ($)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
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
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Asignando..." : "Asignar CER"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
