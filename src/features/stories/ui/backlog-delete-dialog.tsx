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

type BacklogDeleteDialogProps = {
  open: boolean
  title: string
  itemName: string
  confirmLabel: string
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export const BacklogDeleteDialog = ({
  open,
  title,
  itemName,
  confirmLabel,
  isPending,
  onClose,
  onConfirm,
}: BacklogDeleteDialogProps) => {
  useEffect(() => {
    if (!open) {
      return
    }

    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.removeProperty("overflow")
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isPending, onClose, open])

  if (!open) {
    return null
  }

  const canInteract = !isPending

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (canInteract) {
            onClose()
          }
        }}
      />
      <Card className="relative z-10 w-full max-w-sm shadow-lg">
        <CardHeader className="justify-items-center text-center">
          <div className="bg-destructive/10 text-destructive mx-auto flex size-14 items-center justify-center rounded-full">
            <TrashIcon className="size-7" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            ¿Seguro que quieres eliminar{" "}
            <span className="text-foreground font-semibold">{itemName}</span>?
            Esta acción no se puede deshacer.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!canInteract}
            onClick={onClose}
          >
            <XIcon />
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canInteract}
            onClick={onConfirm}
          >
            <TrashIcon />
            {isPending ? "Eliminando..." : confirmLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>,
    document.body
  )
}
