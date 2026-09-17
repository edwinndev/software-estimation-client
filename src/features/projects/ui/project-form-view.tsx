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
import { ProjectForm } from "./project-form"

const ProjectFormPage = ({
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
                href="/projects"
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
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
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
