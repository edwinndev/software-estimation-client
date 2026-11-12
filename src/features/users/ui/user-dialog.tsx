"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserForm } from "./user-form"
import type { User } from "../types"

type UserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export const UserDialog = ({
  open,
  onOpenChange,
  user,
}: UserDialogProps) => {
  const isEditing = Boolean(user)

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar usuario" : "Registrar nuevo usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos personales y el rol de acceso del usuario."
              : "Ingresa los datos para registrar un usuario y enviarle su código de activación."}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          user={user ?? null}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
