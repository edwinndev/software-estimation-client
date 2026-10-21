"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useProject } from "../hooks/use-projects"
import { ProjectForm } from "./project-form"

const ProjectFormPage = ({
  title,
  description,
  backHref = "/projects",
  children,
}: {
  title: ReactNode
  description: ReactNode
  backHref?: string
  children: ReactNode
}) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-start gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={backHref}
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
            <span className="sr-only">Volver a proyectos</span>
          </TooltipTrigger>
          <TooltipContent>Volver a proyectos</TooltipContent>
        </Tooltip>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </div>
  )
}

export const ProjectCreateView = () => {
  return (
    <ProjectFormPage
      title="Nuevo proyecto"
      description="Registra un nuevo proyecto con estado inicial borrador."
    >
      <ProjectForm project={null} />
    </ProjectFormPage>
  )
}

export const ProjectEditView = ({ projectId }: { projectId: string }) => {
  const router = useRouter()
  const { data: project, isLoading, isError } = useProject(projectId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-destructive flex items-center gap-2">
          <p>Error al cargar el proyecto o no fue encontrado.</p>
        </div>
        <div>
          <Button variant="outline" onClick={() => router.push("/projects")}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProjectFormPage
      backHref="/projects"
      title={
        <>
          Editar proyecto:{" "}
          <span className="text-foreground font-extrabold">
            {project.nombre}
          </span>
        </>
      }
      description="Modifica los detalles y configuración del proyecto."
    >
      <ProjectForm project={project} />
    </ProjectFormPage>
  )
}
