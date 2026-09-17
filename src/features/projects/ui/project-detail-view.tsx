"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProject } from "../hooks/use-projects"
import { ProjectForm } from "./project-form"

interface ProjectDetailViewProps {
  projectId: string
}

export const ProjectDetailView = ({ projectId }: ProjectDetailViewProps) => {
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proyectos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar proyecto</CardTitle>
          <CardDescription>Modifica los detalles del proyecto.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} />
        </CardContent>
      </Card>
    </div>
  )
}
