"use client"

import { useForm } from "@tanstack/react-form"
import { SaveIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile-schema"
import { useCreateProfile, useUpdateProfile } from "../hooks"
import {
  EXPERIENCE_LEVEL_OPTIONS,
  TECHNICAL_ROLE_OPTIONS,
  type Profile,
} from "../types"

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
    hourlyRate: profile?.hourlyRate ?? 0,
    currency: profile?.currency ?? "PEN",
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
            description: `Los datos de ${value.name} se guardaron correctamente.`,
            type: "success",
          })
        } else {
          await createProfileMutation.mutateAsync(value)
          toast.add({
            title: "Perfil creado",
            description: `${value.name} se registró correctamente.`,
            type: "success",
          })
        }
        onSuccess?.()
      } catch (error) {
        toast.add({
          title: "No se pudo guardar el perfil",
          description: getErrorMessage(error, "Inténtalo de nuevo."),
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
            {getFieldError(field.state.meta.errors) ? (
              <p className="text-destructive text-xs">
                {getFieldError(field.state.meta.errors)}
              </p>
            ) : null}
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
                  <SelectValue placeholder="Selecciona un rol">
                    {TECHNICAL_ROLE_OPTIONS.find(
                      (role) => role.value === field.state.value
                    )?.label ?? "Selecciona un rol"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TECHNICAL_ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
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
                  <SelectValue placeholder="Selecciona nivel">
                    {EXPERIENCE_LEVEL_OPTIONS.find(
                      (level) => level.value === field.state.value
                    )?.label ?? "Selecciona nivel"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
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
              <NumberInput
                id={field.name}
                value={field.state.value}
                min={0}
                max={9999}
                step={0.5}
                disabled={isSubmitting}
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
                value="PEN"
                onValueChange={() => {
                  field.handleChange("PEN")
                }}
                disabled
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="PEN (S/)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">PEN (S/)</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
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
            {getFieldError(field.state.meta.errors) ? (
              <p className="text-destructive text-xs">
                {getFieldError(field.state.meta.errors)}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="isActive">
        {(field) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              checked={field.state.value}
              disabled={isSubmitting}
              onCheckedChange={(checked) =>
                field.handleChange(checked === true)
              }
            />
            <Label htmlFor={field.name}>Perfil activo</Label>
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
            <XIcon />
            Cancelar
          </Button>
        )}
        <FormSubmitButton
          form={form}
          schema={profileSchema}
          isPending={isSubmitting}
        >
          {({ isBusy }) => (
            <>
              <SaveIcon />
              {isBusy
                ? "Guardando..."
                : isEditing
                  ? "Actualizar perfil"
                  : "Registrar perfil"}
            </>
          )}
        </FormSubmitButton>
      </div>
    </form>
  )
}
