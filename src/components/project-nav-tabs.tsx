"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
  ArrowLeftIcon,
  FolderIcon,
  ListTodoIcon,
  CalculatorIcon,
  BanknoteIcon,
  ShieldAlertIcon,
  FileBarChartIcon,
} from "lucide-react"
import { useProject } from "@/features/projects/hooks/use-projects"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export const ProjectNavTabs = () => {
  const pathname = usePathname()
  const params = useParams()
  const projectId = params?.projectId as string

  const { data: project } = useProject(projectId)

  const tabs = [
    {
      title: "General",
      href: `/projects/${projectId}`,
      icon: FolderIcon,
      exact: true,
    },
    {
      title: "Historias y tareas",
      href: `/projects/${projectId}/backlog`,
      icon: ListTodoIcon,
    },
    {
      title: "Estimación",
      href: `/projects/${projectId}/estimation`,
      icon: CalculatorIcon,
    },
    {
      title: "Cálculo de costos",
      href: `/projects/${projectId}/costs`,
      icon: BanknoteIcon,
    },
    {
      title: "Riesgo y contingencia",
      href: `/projects/${projectId}/risks`,
      icon: ShieldAlertIcon,
    },
    {
      title: "Reportes",
      href: `/projects/${projectId}/reports`,
      icon: FileBarChartIcon,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
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
            <span className="sr-only">Volver a proyectos</span>
          </TooltipTrigger>
          <TooltipContent>Volver a proyectos</TooltipContent>
        </Tooltip>
        <div className="min-w-0">
          {project ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">
                {project.nombre}
              </h1>
              <p className="text-muted-foreground text-sm">
                Gestiona el backlog, la estimación, los costos y los riesgos de
                este proyecto.
              </p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="bg-muted h-8 w-64 animate-pulse rounded-md" />
              <div className="bg-muted h-4 w-80 animate-pulse rounded-md" />
            </div>
          )}
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-1 border-b pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`)

          return (
            <Link
              key={tab.title}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{tab.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
