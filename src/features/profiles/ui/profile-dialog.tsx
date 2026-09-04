"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileForm } from "./profile-form"
import type { Profile } from "../types"

type ProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile?: Profile | null
}

export const ProfileDialog = ({
  open,
  onOpenChange,
  profile,
}: ProfileDialogProps) => {
  const isEditing = Boolean(profile)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Actualizar perfil técnico"
              : "Registrar perfil técnico"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del perfil técnico y su costo estándar por recurso (CER)."
              : "Registra un nuevo rol técnico y asigna su costo estándar por hora (CER)."}
          </DialogDescription>
        </DialogHeader>
        <ProfileForm
          profile={profile}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
