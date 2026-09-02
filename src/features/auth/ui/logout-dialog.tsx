"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { LogOutIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useLogout } from "../hooks/use-logout"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const logout = useLogout()
  const [isReady, setIsReady] = useState(false)
  const [readyForOpen, setReadyForOpen] = useState(open)

  if (open !== readyForOpen) {
    setReadyForOpen(open)
    setIsReady(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const readyTimer = window.setTimeout(() => {
      setIsReady(true)
    }, 300)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !logout.isPending) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      window.clearTimeout(readyTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [logout.isPending, onOpenChange, open])

  if (!open) {
    return null
  }

  const canInteract = isReady && !logout.isPending

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (canInteract) {
            onOpenChange(false)
          }
        }}
      />
      <Card className="relative z-10 w-full max-w-sm shadow-lg">
        <CardHeader className="justify-items-center text-center">
          <div className="bg-destructive/10 text-destructive mx-auto flex size-14 items-center justify-center rounded-full">
            <LogOutIcon className="size-7" />
          </div>
          <CardTitle>Cerrar sesión</CardTitle>
          <CardDescription>
            ¿Seguro que quieres cerrar sesión? Tendrás que volver a iniciar
            sesión para acceder a la plataforma.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!canInteract}
            onClick={() => onOpenChange(false)}
          >
            <XIcon />
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canInteract}
            onClick={() => {
              if (canInteract) {
                logout.mutate()
              }
            }}
          >
            <LogOutIcon />
            {logout.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </CardFooter>
      </Card>
    </div>,
    document.body
  )
}
