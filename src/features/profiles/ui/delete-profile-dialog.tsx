"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useDeleteProfile } from "../hooks/use-profiles"
import type { Profile } from "../types"

type DeleteProfileDialogProps = {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DeleteProfileDialog = ({
  profile,
  open,
  onOpenChange,
}: DeleteProfileDialogProps) => {
  const deleteMutation = useDeleteProfile()

  if (!profile) return null

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(profile.id)
      toast.add({
        title: "Perfil eliminado",
        description: `El perfil "${profile.name}" ha sido eliminado.`,
        type: "success",
      })
      onOpenChange(false)
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el perfil.",
        type: "error",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Eliminar perfil técnico</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el perfil{" "}
            <span className="text-foreground font-semibold">
              {profile.name}
            </span>{" "}
            ({profile.role})? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar perfil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
