"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "../hooks/use-session"

export const RequireGuest = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const { data: session, isLoading } = useSession()

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/projects")
    }
  }, [isLoading, router, session])

  if (isLoading || session) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    )
  }

  return children
}
