"use client"

import { useForm } from "@tanstack/react-form"
import { SaveIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useResetPassword } from "../hooks/use-reset-password"
import { resetPasswordSchema } from "../schemas/reset-password-schema"
import { AuthField } from "./auth-field"
import { PasswordInput } from "./password-input"

type ResetPasswordFormProps = {
  email: string
}

export const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const resetPassword = useResetPassword()

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await resetPassword.mutateAsync({
          email,
          password: value.password,
        })
        toast.add({
          title: "Contraseña actualizada",
          description: "Ya puedes iniciar sesión con tu nueva contraseña.",
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo guardar la contraseña",
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
      {resetPassword.error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo guardar</AlertTitle>
          <AlertDescription>
            {getErrorMessage(
              resetPassword.error,
              "Revisa los datos e inténtalo de nuevo."
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      <form.Field name="password">
        {(field) => {
          const error = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Nueva contraseña"
              htmlFor="reset-password"
              error={error}
              hint="Mínimo 8 caracteres, con al menos una letra y un número."
            >
              <PasswordInput
                id="reset-password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => {
          const error = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Confirmar contraseña"
              htmlFor="reset-confirm-password"
              error={error}
            >
              <PasswordInput
                id="reset-confirm-password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            disabled={isSubmitting || resetPassword.isPending}
          >
            <SaveIcon />
            {isSubmitting || resetPassword.isPending
              ? "Guardando..."
              : "Guardar contraseña"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
