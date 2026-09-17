"use client"

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
import { toast } from "@/components/ui/toast"
import {
  experienceLevels,
  profileSchema,
  technicalRoles,
  type ProfileFormValues,
} from "../schemas/profile-schema"
import { useCreateProfile, useUpdateProfile } from "../hooks/use-profiles"
import type { Profile } from "../types"

type ProfileFormProps = {
  profile?: Profile | null
  onSuccess?: () => void
  onCancel?: () => void
}

export const ProfileForm = ({
  profile,
  onSuccess,
  onCancel,
}: ProfileFormProps) => {
  const isEditing = Boolean(profile)
  const createProfileMutation = useCreateProfile()
  const updateProfileMutation = useUpdateProfile()

  const defaultValues: ProfileFormValues = {
    name: profile?.name ?? "",
    role: profile?.role ?? "Frontend",
    hourlyRate: profile?.hourlyRate ?? 40,
    currency: profile?.currency ?? "USD",
    experienceLevel: profile?.experienceLevel ?? "Mid",
    email: profile?.email ?? "",
    isActive: profile?.isActive ?? true,
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        if (isEditing && profile) {
          await updateProfileMutation.mutateAsync({
            id: profile.id,
            ...value,
          })
          toast.add({
            title: "Perfil actualizado",
            description: `El perfil "${value.name}" ha sido actualizado exitosamente.`,
            type: "success",
          })
        } else {
          await createProfileMutation.mutateAsync(value)
          toast.add({
            title: "Perfil creado",
            description: `El perfil técnico "${value.name}" ha sido registrado.`,
            type: "success",
          })
        }
        onSuccess?.()
      } catch (error) {
        toast.add({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "No se pudo guardar el perfil. Intenta nuevamente.",
          type: "error",
        })
      }
    },
  })

  const isSubmitting =
    createProfileMutation.isPending || updateProfileMutation.isPending

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const res = profileSchema.shape.name.safeParse(value)
            return res.success ? undefined : res.error.issues[0]?.message
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Nombre completo</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej. Ana García"
              disabled={isSubmitting}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-xs">
                {typeof field.state.meta.errors[0] === "string"
                  ? field.state.meta.errors[0]
                  : ((field.state.meta.errors[0] as { message?: string })
                      ?.message ?? "Campo requerido")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="role"
          validators={{
            onChange: ({ value }) => {
              const res = profileSchema.shape.role.safeParse(value)
              return res.success ? undefined : res.error.issues[0]?.message
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Rol técnico</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val) field.handleChange(val as ProfileFormValues["role"])
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {technicalRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <form.Field
          name="experienceLevel"
          validators={{
            onChange: ({ value }) => {
              const res = profileSchema.shape.experienceLevel.safeParse(value)
              return res.success ? undefined : res.error.issues[0]?.message
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Nivel de seniority</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val)
                    field.handleChange(
                      val as ProfileFormValues["experienceLevel"]
                    )
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="Selecciona nivel" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="hourlyRate"
          validators={{
            onChange: ({ value }) => {
              const res = profileSchema.shape.hourlyRate.safeParse(value)
              return res.success ? undefined : res.error.issues[0]?.message
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Costo estándar / hora (CER)</Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type="number"
                  step="0.5"
                  min="1"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.valueAsNumber || 0)
                  }
                  placeholder="Ej. 45"
                  disabled={isSubmitting}
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

        <form.Field
          name="currency"
          validators={{
            onChange: ({ value }) => {
              const res = profileSchema.shape.currency.safeParse(value)
              return res.success ? undefined : res.error.issues[0]?.message
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Moneda</Label>
              <Select
                value={field.state.value || "USD"}
                onValueChange={(val) => {
                  if (val) field.handleChange(val)
                }}
                disabled
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="USD ($)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
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
      </div>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const res = profileSchema.shape.email.safeParse(value)
            return res.success ? undefined : res.error.issues[0]?.message
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Correo electrónico</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej. ana@empresa.com"
              disabled={isSubmitting}
            />
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

      <div className="flex justify-end gap-2 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Actualizar perfil"
              : "Registrar perfil"}
        </Button>
      </div>
    </form>
  )
}
