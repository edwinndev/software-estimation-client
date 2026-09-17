"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { SaveIcon, XIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthField } from "@/features/auth/ui/auth-field"
import { PasswordInput } from "@/features/auth/ui/password-input"
import { DEFAULT_USER_ROLE, isUserRole } from "@/features/auth/types"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useCreateUser } from "../hooks/use-create-user"
import { useUpdateUser } from "../hooks/use-update-user"
import { createUserSchema } from "../schemas/create-user-schema"
import { updateUserSchema } from "../schemas/update-user-schema"
import type { User } from "../types"
import { RoleSelect } from "./role-select"

type UserFormProps = {
  user: User | null
}

export const UserForm = ({ user }: UserFormProps) => {
  const router = useRouter()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isEditing = Boolean(user)
  const isPending = createUser.isPending || updateUser.isPending
  const error = createUser.error || updateUser.error

  const form = useForm({
    defaultValues: {
      firstName: user ? user.firstName : "",
      lastName: user ? user.lastName : "",
      email: user ? user.email : "",
      role: user ? user.role : DEFAULT_USER_ROLE,
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: isEditing ? updateUserSchema : createUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (user) {
          await updateUser.mutateAsync({
            userId: user.id,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            role: value.role,
            password: value.password,
          })
          toast.add({
            title: "Usuario actualizado",
            description: `Los datos de ${value.firstName} ${value.lastName} se guardaron correctamente.`,
            type: "success",
          })
        } else {
          await createUser.mutateAsync({
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            role: value.role,
            password: value.password,
          })
          toast.add({
            title: "Usuario creado",
            description: `La cuenta de ${value.firstName} ${value.lastName} se creó desactivada. Actívala desde la tabla para que pueda iniciar sesión.`,
            type: "success",
          })
        }

        router.push("/users")
      } catch (error) {
        toast.add({
          title: "No se pudo guardar el usuario",
          description: getErrorMessage(
            error,
            "Revisa los datos e inténtalo de nuevo."
          ),
          type: "error",
        })
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo guardar</AlertTitle>
          <AlertDescription>
            {getErrorMessage(error, "Revisa los datos e inténtalo de nuevo.")}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="firstName">
          {(field) => {
            const fieldError = getFieldError(field.state.meta.errors)

            return (
              <AuthField
                label="Nombre"
                htmlFor="user-first-name"
                error={fieldError}
              >
                <Input
                  id="user-first-name"
                  value={field.state.value}
                  placeholder="Ej. Neil"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(fieldError)}
                />
              </AuthField>
            )
          }}
        </form.Field>

        <form.Field name="lastName">
          {(field) => {
            const fieldError = getFieldError(field.state.meta.errors)

            return (
              <AuthField
                label="Apellido"
                htmlFor="user-last-name"
                error={fieldError}
              >
                <Input
                  id="user-last-name"
                  value={field.state.value}
                  placeholder="Ej. Armstrong"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(fieldError)}
                />
              </AuthField>
            )
          }}
        </form.Field>
      </div>

      <form.Field name="email">
        {(field) => {
          const fieldError = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Correo electrónico"
              htmlFor="user-email"
              error={fieldError}
            >
              <Input
                id="user-email"
                type="email"
                value={field.state.value}
                placeholder="Ej. neil.armstrong@correo.com"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(fieldError)}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <form.Field name="role">
        {(field) => {
          const fieldError = getFieldError(field.state.meta.errors)

          return (
            <AuthField label="Rol" htmlFor="user-role" error={fieldError}>
              <RoleSelect
                id="user-role"
                value={field.state.value}
                onValueChange={(value) => {
                  if (isUserRole(value)) {
                    field.handleChange(value)
                  }
                }}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const fieldError = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label={isEditing ? "Nueva contraseña" : "Contraseña"}
              htmlFor="user-password"
              error={fieldError}
              hint={
                isEditing
                  ? "Déjala vacía si no quieres cambiarla."
                  : "Mínimo 8 caracteres, con al menos una letra y un número."
              }
            >
              <PasswordInput
                id="user-password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(fieldError)}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => {
          const fieldError = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Confirmar contraseña"
              htmlFor="user-confirm-password"
              error={fieldError}
            >
              <PasswordInput
                id="user-confirm-password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(fieldError)}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.push("/users")}
        >
          <XIcon />
          Cancelar
        </Button>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || isPending}>
              <SaveIcon />
              {isSubmitting || isPending
                ? isEditing
                  ? "Actualizando usuario..."
                  : "Guardando usuario..."
                : isEditing
                  ? "Actualizar usuario"
                  : "Guardar usuario"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
