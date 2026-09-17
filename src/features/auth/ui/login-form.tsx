"use client"

import { useForm } from "@tanstack/react-form"
import Link from "next/link"
import { LogInIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { useLogin } from "../hooks/use-login"
import { loginSchema } from "../schemas/login-schema"
import { AuthField } from "./auth-field"
import { PasswordInput } from "./password-input"

export const LoginForm = () => {
  const login = useLogin()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await login.mutateAsync(value)
        toast.add({
          title: "Sesión iniciada",
          description: "Bienvenido de nuevo. Ya puedes usar la plataforma.",
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo iniciar sesión",
          description: getErrorMessage(
            error,
            "Revisa tus credenciales e inténtalo de nuevo."
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
      {login.error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo iniciar sesión</AlertTitle>
          <AlertDescription>
            {getErrorMessage(
              login.error,
              "Revisa tus credenciales e inténtalo de nuevo."
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
              htmlFor="login-email"
              error={error}
            >
              <Input
                id="login-email"
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

      <form.Field name="password">
        {(field) => {
          const error = getFieldError(field.state.meta.errors)

          return (
            <AuthField
              label="Contraseña"
              htmlFor="login-password"
              error={error}
            >
              <PasswordInput
                id="login-password"
                autoComplete="current-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
              />
            </AuthField>
          )
        }}
      </form.Field>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-muted-foreground text-sm underline"
        >
          Olvidé mi contraseña
        </Link>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting || login.isPending}>
            <LogInIcon />
            {isSubmitting || login.isPending
              ? "Ingresando..."
              : "Iniciar sesión"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
