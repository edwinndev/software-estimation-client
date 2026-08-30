"use client"

import { AuthBrand } from "./auth-brand"
import { AuthSplitCard } from "./auth-split-card"
import { LoginForm } from "./login-form"

export const LoginView = () => {
  return (
    <AuthSplitCard>
      <div className="flex flex-col gap-6">
        <AuthBrand />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-muted-foreground text-sm">
            Ingresa las credenciales asignadas por el administrador.
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthSplitCard>
  )
}
