"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { usePermissions } from "../hooks/use-permissions"
import { useSession } from "../hooks/use-session"

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isLoading } = useSession()
  const { canAccessPath } = usePermissions()
  const canAccess = session ? canAccessPath(pathname) : false

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!session) {
      router.replace("/login")
      return
    }

    if (!canAccess) {
      router.replace("/projects")
    }
  }, [canAccess, isLoading, router, session])

  if (isLoading || !session || !canAccess) {
    return (
      <div className="bg-muted/40 flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    )
  }

  return children
}
