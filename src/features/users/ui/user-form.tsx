"use client"

import { useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { SaveIcon, XIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthField } from "@/features/auth/ui/auth-field"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useCreateUser } from "../hooks/use-create-user"
import { useRoles } from "../hooks/use-roles"
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
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles(true)
  const isEditing = Boolean(user)
  const isPending = createUser.isPending || updateUser.isPending
  const error = createUser.error || updateUser.error
  const assignableRoles = roles.filter((role) => !role.isSystem)
  const defaultRoleId =
    user?.roleId ||
    assignableRoles.find((role) => role.code === "estimator")?.id ||
    assignableRoles[0]?.id ||
    ""

  const form = useForm({
    defaultValues: {
      firstName: user ? user.firstName : "",
      lastName: user ? user.lastName : "",
      email: user ? user.email : "",
      roleId: defaultRoleId,
      isActive: user ? user.isActive : true,
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
            roleId: value.roleId,
            isActive: value.isActive,
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
            roleId: value.roleId,
            isActive: true,
          })
          toast.add({
            title: "Usuario creado",
            description: `Se envió una invitación OTP a ${value.email} para activar la cuenta.`,
            type: "success",
          })
        }

        router.push("/users")
      } catch (submitError) {
        toast.add({
          title: "No se pudo guardar el usuario",
          description: getErrorMessage(submitError, "Inténtalo de nuevo."),
          type: "error",
        })
      }
    },
  })

  useEffect(() => {
    if (!form.state.values.roleId && defaultRoleId) {
      form.setFieldValue("roleId", defaultRoleId)
    }
  }, [defaultRoleId, form])

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
                required
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
                required
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
              required
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

      <form.Field name="roleId">
        {(field) => {
          const fieldError = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Rol"
              htmlFor="user-role"
              error={fieldError}
              required
              hint={
                isEditing
                  ? undefined
                  : "El usuario recibirá un correo con un código OTP para crear su contraseña."
              }
            >
              <RoleSelect
                id="user-role"
                value={field.state.value}
                roles={roles}
                excludeSystem={!isEditing}
                disabled={
                  isLoadingRoles || (!isEditing && assignableRoles.length === 0)
                }
                onValueChange={(value) => field.handleChange(value)}
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
        <FormSubmitButton
          form={form}
          schema={isEditing ? updateUserSchema : createUserSchema}
          isPending={isPending || isLoadingRoles}
        >
          {({ isBusy }) => (
            <>
              <SaveIcon />
              {isBusy
                ? isEditing
                  ? "Actualizando usuario..."
                  : "Guardando usuario..."
                : isEditing
                  ? "Actualizar usuario"
                  : "Guardar usuario"}
            </>
          )}
        </FormSubmitButton>
      </div>
    </form>
  )
}
