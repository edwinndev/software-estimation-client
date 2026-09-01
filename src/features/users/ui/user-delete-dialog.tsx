"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { TrashIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { getFullName } from "@/features/auth/types"
import { getErrorMessage } from "@/lib/form-errors"
import { useDeleteUser } from "../hooks/use-delete-user"
import type { User } from "../types"

type UserDeleteDialogProps = {
  open: boolean
  user: User | null
  onOpenChange: (open: boolean) => void
}

export const UserDeleteDialog = ({
  open,
  user,
  onOpenChange,
}: UserDeleteDialogProps) => {
  const deleteUser = useDeleteUser()

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleteUser.isPending) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [deleteUser.isPending, onOpenChange, open])

  if (!open || !user) {
    return null
  }

  const canInteract = !deleteUser.isPending
  const fullName = getFullName(user)

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
            <TrashIcon className="size-7" />
          </div>
          <CardTitle>Eliminar usuario</CardTitle>
          <CardDescription>
            ¿Seguro que quieres eliminar a{" "}
            <span className="text-foreground font-semibold">{fullName}</span>?
            Esta persona ya no podrá iniciar sesión.
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
            onClick={async () => {
              if (!canInteract) {
                return
              }

              try {
                await deleteUser.mutateAsync(user.id)
                toast.add({
                  title: "Usuario eliminado",
                  description: `La cuenta de ${fullName} se eliminó correctamente.`,
                  type: "success",
                })
                onOpenChange(false)
              } catch (error) {
                toast.add({
                  title: "No se pudo eliminar el usuario",
                  description: getErrorMessage(
                    error,
                    "Revisa el usuario e inténtalo de nuevo."
                  ),
                  type: "error",
                })
              }
            }}
          >
            <TrashIcon />
            {deleteUser.isPending ? "Eliminando..." : "Eliminar usuario"}
          </Button>
        </CardFooter>
      </Card>
    </div>,
    document.body
  )
}
