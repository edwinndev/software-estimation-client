"use client"

import * as React from "react"
import { Loader2Icon, XIcon } from "lucide-react"
import { Button, type buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type ConfirmDialogTone =
  | "destructive"
  | "warning"
  | "success"
  | "info"
  | "neutral"

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>

const TONE_STYLES: Record<ConfirmDialogTone, string> = {
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  neutral: "bg-muted text-foreground",
}

const MAX_WIDTH_STYLES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
}

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description: React.ReactNode
  icon?: React.ReactNode
  tone?: ConfirmDialogTone
  confirmText?: React.ReactNode
  confirmLoadingText?: React.ReactNode
  confirmIcon?: React.ReactNode
  cancelText?: React.ReactNode
  cancelIcon?: React.ReactNode
  confirmVariant?: ButtonVariant
  isLoading?: boolean
  maxWidth?: "sm" | "md" | "lg"
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  icon,
  tone,
  confirmText = "Confirmar",
  confirmLoadingText,
  confirmIcon,
  cancelText = "Cancelar",
  cancelIcon = <XIcon />,
  confirmVariant = "default",
  isLoading = false,
  maxWidth = "md",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const resolvedTone: ConfirmDialogTone =
    tone ?? (confirmVariant === "destructive" ? "destructive" : "info")

  const handleCancel = () => {
    if (isLoading) return
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    if (isLoading) return
    await onConfirm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!isLoading) {
          if (!val) {
            onCancel?.()
          }
          onOpenChange(val)
        }
      }}
    >
      <DialogContent
        className={cn(MAX_WIDTH_STYLES[maxWidth])}
        showCloseButton={!isLoading}
      >
        <DialogHeader className="items-center text-center sm:text-center">
          {icon ? (
            <div
              className={cn(
                "mx-auto mb-1 flex size-12 items-center justify-center rounded-full",
                TONE_STYLES[resolvedTone]
              )}
            >
              {icon}
            </div>
          ) : null}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleCancel}
          >
            {cancelIcon}
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              confirmIcon
            )}
            {isLoading
              ? (confirmLoadingText ?? confirmText)
              : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
