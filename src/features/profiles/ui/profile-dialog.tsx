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
              ? "Update technical profile"
              : "Register technical profile"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify technical profile details and standard cost per hour (CER)."
              : "Register a new technical role and assign its standard hourly cost (CER)."}
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
