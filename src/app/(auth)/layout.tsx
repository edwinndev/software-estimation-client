"use client"

import type { ReactNode } from "react"
import { AuthSceneBackdrop } from "@/features/auth/ui/auth-scene-backdrop"
import { RequireGuest } from "@/features/auth/ui/require-guest"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RequireGuest>
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <AuthSceneBackdrop />
        <div className="relative w-full max-w-5xl">{children}</div>
      </div>
    </RequireGuest>
  )
}

export default AuthLayout
