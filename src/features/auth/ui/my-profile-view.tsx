"use client"

import { useRef, useState, type ChangeEvent } from "react"
import {
  UploadCloudIcon,
  Trash2Icon,
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  XIcon,
  ImageIcon,
  CircleCheckIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/status-badge"
import { toast } from "@/components/ui/toast"
import { useSession } from "../hooks/use-session"
import { useUserAvatar } from "../hooks/use-user-avatar"
import {
  getFullName,
  getInitials,
  ROLE_BY_VALUE,
  ROLE_ITEM_ICON,
} from "../types"

export const MyProfileView = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null)
  const { data: session, isLoading } = useSession()
  const { avatar, saveAvatar, removeAvatar } = useUserAvatar(session?.userId)

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-lg border p-6 lg:col-span-4">
            <Skeleton className="mx-auto h-32 w-32 rounded-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-4 rounded-lg border p-6 lg:col-span-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex w-full flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          No se pudo cargar la información de la sesión.
        </p>
      </div>
    )
  }

  const fullName = getFullName(session)
  const initials = getInitials(session)
  const displayedAvatar = pendingPhoto ?? avatar
  const role = ROLE_BY_VALUE[session.role] ?? null
  const RoleIcon = ROLE_ITEM_ICON

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Archivo inválido",
        description: "Por favor selecciona una imagen válida (JPG, PNG, WebP).",
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

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (dataUrl) {
        setPendingPhoto(dataUrl)
        toast.add({
          title: "Imagen cargada en vista previa",
          description: "Haz clic en 'Subir foto' para confirmar el cambio.",
          type: "info",
        })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleConfirmUpload = () => {
    if (!pendingPhoto) return
    saveAvatar(pendingPhoto)
    setPendingPhoto(null)
    toast.add({
      title: "Foto guardada",
      description: "Tu foto de perfil se actualizó correctamente.",
      type: "success",
    })
  }

  const handleCancelPending = () => {
    setPendingPhoto(null)
    toast.add({
      title: "Cancelado",
      description: "Se descartó la imagen seleccionada.",
      type: "info",
    })
  }

  const handleRemovePhoto = () => {
    setPendingPhoto(null)
    removeAvatar()
    toast.add({
      title: "Foto eliminada",
      description: "Se restauró el avatar predeterminado con tus iniciales.",
      type: "info",
    })
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
        <p className="text-muted-foreground text-sm">
          Información personal y configuración de tu cuenta en la plataforma.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Photo & Avatar */}
        <Card className="flex flex-col justify-between lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Foto de perfil</CardTitle>
            <CardDescription>
              Tu imagen visible en el sistema y barra de navegación.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-5 pt-2">
            <div className="relative">
              <Avatar className="border-primary/20 size-32 rounded-full border-2 shadow-md">
                {displayedAvatar ? (
                  <AvatarImage
                    src={displayedAvatar}
                    alt={fullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {pendingPhoto ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500" />
                </span>
              ) : null}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {pendingPhoto ? (
              <div className="w-full space-y-2 text-center">
                <Badge
                  variant="outline"
                  className="border-amber-300 bg-amber-50 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  Foto en vista previa
                </Badge>
                <div className="flex w-full flex-col gap-2 pt-1">
                  <Button
                    type="button"
                    variant="default"
                    className="w-full"
                    onClick={handleConfirmUpload}
                  >
                    <UploadCloudIcon className="mr-1.5 size-4" />
                    Subir foto
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleCancelPending}
                  >
                    <XIcon className="mr-1.5 size-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mr-1.5 size-4" />
                  {avatar ? "Cambiar foto" : "Cargar foto"}
                </Button>

                {avatar ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                    onClick={handleRemovePhoto}
                  >
                    <Trash2Icon className="mr-1.5 size-4" />
                    Quitar foto
                  </Button>
                ) : null}
              </div>
            )}

            <p className="text-muted-foreground text-center text-xs">
              Formatos JPG, PNG o WebP. Máximo 2MB.
            </p>
          </CardContent>
        </Card>

        {/* Right Column: Clean Details (Without nested cards) */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  Información de la cuenta
                </CardTitle>
                <CardDescription>
                  Datos personales y credenciales registradas.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="divide-y text-sm">
              <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-3">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <UserIcon className="size-4" />
                  Nombres
                </span>
                <span className="text-foreground text-base font-semibold sm:col-span-2">
                  {session.firstName}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-3">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <UserIcon className="size-4" />
                  Apellidos
                </span>
                <span className="text-foreground text-base font-semibold sm:col-span-2">
                  {session.lastName}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-3">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MailIcon className="size-4" />
                  Correo electrónico
                </span>
                <span className="text-foreground text-base font-semibold sm:col-span-2">
                  {session.email}
                </span>
              </div>

              <div className="grid grid-cols-1 items-center gap-1 py-3.5 sm:grid-cols-3">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <ShieldCheckIcon className="size-4" />
                  Rol asignado
                </span>
                <div className="sm:col-span-2">
                  <Badge variant="secondary" className="gap-1.5 font-medium">
                    <RoleIcon className="size-3.5" />
                    {role ? role.label : session.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 items-center gap-1 py-3.5 sm:grid-cols-3">
                <span className="text-muted-foreground font-medium">
                  Estado
                </span>
                <div className="sm:col-span-2">
                  <StatusBadge
                    tone="success"
                    label="Activo"
                    icon={CircleCheckIcon}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
