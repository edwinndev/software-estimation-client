"use client"

import { useForm } from "@tanstack/react-form"
import { MailIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useRequestPasswordReset } from "../hooks/use-request-password-reset"
import { requestResetSchema } from "../schemas/request-reset-schema"
import { AuthField } from "./auth-field"

export const RequestResetForm = () => {
  const requestReset = useRequestPasswordReset()

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: requestResetSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await requestReset.mutateAsync(value)
        toast.add({
          title: "Código enviado",
          description:
            "Revisa la consola del navegador. El código dura 10 minutos.",
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo enviar el código",
          description: getErrorMessage(
            error,
            "Revisa el correo e inténtalo de nuevo."
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
      {requestReset.error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo enviar el código</AlertTitle>
          <AlertDescription>
            {getErrorMessage(
              requestReset.error,
              "Revisa el correo e inténtalo de nuevo."
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      <form.Field name="email">
        {(field) => {
          const error = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Correo electrónico"
              htmlFor="reset-email"
              error={error}
            >
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={field.state.value}
                placeholder="Ej. neil.armstrong@correo.com"
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
            disabled={isSubmitting || requestReset.isPending}
          >
            <MailIcon />
            {isSubmitting || requestReset.isPending
              ? "Enviando..."
              : "Enviar código"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
