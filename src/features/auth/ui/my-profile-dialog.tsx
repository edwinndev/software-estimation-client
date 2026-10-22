"use client"

import { useRef, useState, type ChangeEvent } from "react"
import {
  CameraIcon,
  Trash2Icon,
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { getFullName, getInitials, ROLE_LABELS, type Session } from "../types"
import { useUserAvatar } from "../hooks/use-user-avatar"

type MyProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: Session
}

export const MyProfileDialog = ({
  open,
  onOpenChange,
  user,
}: MyProfileDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [copiedId, setCopiedId] = useState(false)
  const { avatar, saveAvatar, removeAvatar } = useUserAvatar(user.userId)

  const fullName = getFullName(user)
  const initials = getInitials(user)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      toast.add({
        title: "Archivo inválido",
        description: "Por favor selecciona una imagen JPG o PNG.",
        type: "error",
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        title: "Imagen muy pesada",
        description: "El tamaño máximo permitido es de 2 MB.",
        type: "error",
      })
      return
    }

    void (async () => {
      try {
        await saveAvatar(file)
        toast.add({
          title: "Foto actualizada",
          description: "Tu foto de perfil se guardó correctamente.",
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo subir la foto",
          description:
            error instanceof Error ? error.message : "Inténtalo de nuevo.",
          type: "error",
        })
      }
    })()

    e.target.value = ""
  }

  const handleRemovePhoto = () => {
    void (async () => {
      try {
        await removeAvatar()
        toast.add({
          title: "Foto eliminada",
          description: "Se restauró el avatar con tus iniciales.",
          type: "info",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo eliminar la foto",
          description:
            error instanceof Error ? error.message : "Inténtalo de nuevo.",
          type: "error",
        })
      }
    })()
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.userId)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
      toast.add({
        title: "ID copiado",
        description: "El identificador de usuario se copió al portapapeles.",
        type: "success",
      })
    } catch {
      // fallback
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mi perfil</DialogTitle>
          <DialogDescription>
            Información y personalización de tu cuenta en la plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-2">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="group relative">
              <Avatar className="border-primary/20 size-24 rounded-full border-2 shadow-sm">
                {avatar ? (
                  <AvatarImage
                    src={avatar}
                    alt={fullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-0 cursor-pointer rounded-full p-1.5 shadow-md transition-all"
                title="Cambiar foto de perfil"
              >
                <CameraIcon className="size-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon className="size-3.5" />
                Cambiar foto
              </Button>
              {avatar ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2Icon className="size-3.5" />
                  Quitar
                </Button>
              ) : null}
            </div>
          </div>

          {/* User Information Cards */}
          <div className="bg-muted/30 w-full space-y-3 rounded-lg border p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <UserIcon className="size-4" />
                <span>Nombre</span>
              </div>
              <span className="text-foreground font-medium">{fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <MailIcon className="size-4" />
                <span>Correo</span>
              </div>
              <span className="text-foreground font-medium">{user.email}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <ShieldCheckIcon className="size-4" />
                <span>Rol</span>
              </div>
              <Badge variant="secondary" className="font-medium">
                {user.roleName || ROLE_LABELS[user.role] || user.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <div className="text-muted-foreground flex items-center gap-2">
                <span>Estado</span>
              </div>
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-200 bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Activo
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>ID Usuario</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground max-w-[150px] truncate font-mono text-xs">
                  {user.userId}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopyId}
                  title="Copiar ID"
                >
                  {copiedId ? (
                    <CheckIcon className="size-3 text-emerald-600" />
                  ) : (
                    <CopyIcon className="size-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
