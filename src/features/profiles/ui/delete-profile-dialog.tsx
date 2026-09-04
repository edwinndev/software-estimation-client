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
        title: "Profile deleted",
        description: `Profile "${profile.name}" has been removed.`,
        type: "success",
      })
      onOpenChange(false)
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Could not delete profile.",
        type: "error",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Delete technical profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete profile{" "}
            <span className="text-foreground font-semibold">
              {profile.name}
            </span>{" "}
            ({profile.role})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
