"use client"

import Link from "next/link"
import { AuthBrand } from "./auth-brand"
import { AuthSplitCard } from "./auth-split-card"
import { RequestResetForm } from "./request-reset-form"
import { ResetPasswordForm } from "./reset-password-form"
import { VerifyResetForm } from "./verify-reset-form"

type ForgotPasswordViewProps = {
  step: "request" | "verify" | "reset"
  email: string
}

const copy = {
  request: {
    title: "Olvidé mi contraseña",
    description: "Ingresa tu correo y te generamos un código de verificación.",
  },
  verify: {
    title: "Ingresa el código",
    description: "Escribe el código de 6 dígitos que aparece en la consola.",
  },
  reset: {
    title: "Nueva contraseña",
    description: "Define una contraseña nueva para tu cuenta.",
  },
}

export const ForgotPasswordView = ({
  step,
  email,
}: ForgotPasswordViewProps) => {
  const content = copy[step]

  return (
    <AuthSplitCard>
      <div className="flex flex-col gap-6">
        <AuthBrand />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {content.title}
          </h1>
          <p className="text-muted-foreground text-sm">{content.description}</p>
          {email ? (
            <p className="text-muted-foreground text-sm">{email}</p>
          ) : null}
        </div>

        {step === "request" ? <RequestResetForm /> : null}
        {step === "verify" ? <VerifyResetForm email={email} /> : null}
        {step === "reset" ? <ResetPasswordForm email={email} /> : null}

        <Link href="/login" className="text-muted-foreground text-sm underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthSplitCard>
  )
}
