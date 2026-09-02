"use client"

import { useForm } from "@tanstack/react-form"
import { KeyRoundIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useVerifyResetCode } from "../hooks/use-verify-reset-code"
import { verifyResetSchema } from "../schemas/verify-reset-schema"
import { AuthField } from "./auth-field"

type VerifyResetFormProps = {
  email: string
}

export const VerifyResetForm = ({ email }: VerifyResetFormProps) => {
  const verifyCode = useVerifyResetCode()

  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: verifyResetSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await verifyCode.mutateAsync({ email, code: value.code })
        toast.add({
          title: "Código verificado",
          description: "Ya puedes crear una nueva contraseña para esta cuenta.",
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo verificar el código",
          description: getErrorMessage(
            error,
            "Revisa el código e inténtalo de nuevo."
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
      {verifyCode.error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo verificar</AlertTitle>
          <AlertDescription>
            {getErrorMessage(
              verifyCode.error,
              "Revisa el código e inténtalo de nuevo."
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      <form.Field name="code">
        {(field) => {
          const error = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Código"
              htmlFor="reset-code"
              error={error}
              hint="Revisa la consola del navegador. El código dura 10 minutos."
            >
              <Input
                id="reset-code"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                value={field.state.value}
                placeholder="Ej. 482913"
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
          <Button type="submit" disabled={isSubmitting || verifyCode.isPending}>
            <KeyRoundIcon />
            {isSubmitting || verifyCode.isPending
              ? "Verificando..."
              : "Verificar código"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
