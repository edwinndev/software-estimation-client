"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "../hooks/use-user"
import { UserForm } from "./user-form"

const UserFormPage = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-start gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href="/users"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "icon",
                  }),
                  "rounded-md"
                )}
              />
            }
          >
            <ArrowLeftIcon />
            <span className="sr-only">Volver</span>
          </TooltipTrigger>
          <TooltipContent>Volver</TooltipContent>
        </Tooltip>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Los cambios se aplican a las cuentas internas de la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export const UserCreateView = () => {
  return (
    <UserFormPage
      title="Nuevo usuario"
      description="Crea una cuenta interna con sus credenciales de acceso."
    >
      <UserForm user={null} />
    </UserFormPage>
  )
}

export const UserEditView = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, isError } = useUser(userId)

  return (
    <UserFormPage
      title="Editar usuario"
      description="Actualiza los datos y el acceso del usuario."
    >
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : null}

      {isError ? (
        <p className="text-destructive text-sm">No se encontró el usuario.</p>
      ) : null}

      {user ? <UserForm key={user.id} user={user} /> : null}
    </UserFormPage>
  )
}
