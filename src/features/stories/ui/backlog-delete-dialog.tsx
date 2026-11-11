"use client"

import { TrashIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"

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
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          onClose()
        }
      }}
      title={title}
      icon={<TrashIcon className="size-6" />}
      tone="destructive"
      confirmText={confirmLabel}
      confirmLoadingText="Eliminando..."
      confirmIcon={<TrashIcon />}
      confirmVariant="destructive"
      isLoading={isPending}
      onConfirm={onConfirm}
      onCancel={onClose}
      description={
        <>
          ¿Seguro que quieres eliminar{" "}
          <span className="text-foreground font-semibold">{itemName}</span>?
          Esta acción no se puede deshacer.
        </>
      }
    />
  )
}
