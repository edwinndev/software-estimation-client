"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useProject } from "@/features/projects/hooks/use-projects"

type BreadcrumbCrumb = {
  label: string
  href?: string
}

export const AppBreadcrumb = () => {
  const pathname = usePathname() || ""
  const segments = pathname.split("/").filter(Boolean)

  // Determine if this is a project route with a dynamic project ID
  const isProjectRoute = segments[0] === "projects"
  const possibleProjectId =
    isProjectRoute && segments[1] && segments[1] !== "new" ? segments[1] : ""

  const { data: project, isLoading: isProjectLoading } =
    useProject(possibleProjectId)

  const items: BreadcrumbCrumb[] = []

  if (segments.length === 0) {
    items.push({ label: "Proyectos" })
  } else if (segments[0] === "projects") {
    if (segments.length === 1) {
      items.push({ label: "Proyectos" })
    } else if (segments[1] === "new") {
      items.push({ label: "Proyectos", href: "/projects" })
      items.push({ label: "Nuevo proyecto" })
    } else {
      const projectId = segments[1]
      const projectLabel =
        project?.nombre || (isProjectLoading ? "Cargando..." : "Proyecto")

      items.push({ label: "Proyectos", href: "/projects" })

      if (segments.length === 2) {
        items.push({ label: projectLabel })
      } else {
        items.push({
          label: projectLabel,
          href: `/projects/${projectId}`,
        })

        const action = segments[2]
        if (action === "edit") {
          items.push({ label: "Editar proyecto" })
        } else if (action === "backlog") {
          items.push({ label: "Historias y tareas" })
        } else if (action === "estimation") {
          items.push({ label: "Estimación" })
        } else if (action === "costs") {
          items.push({ label: "Cálculo de costos" })
        } else if (action === "risks") {
          items.push({ label: "Riesgo y contingencia" })
        } else if (action === "reports") {
          items.push({ label: "Reportes" })
        } else {
          items.push({
            label: action.charAt(0).toUpperCase() + action.slice(1),
          })
        }
      }
    }
  } else if (segments[0] === "users") {
    if (segments.length === 1) {
      items.push({ label: "Usuarios" })
    } else if (segments[1] === "new") {
      items.push({ label: "Usuarios", href: "/users" })
      items.push({ label: "Nuevo usuario" })
    } else if (segments[2] === "edit") {
      items.push({ label: "Usuarios", href: "/users" })
      items.push({ label: "Editar usuario" })
    } else {
      items.push({ label: "Usuarios", href: "/users" })
      items.push({ label: "Detalle de usuario" })
    }
  } else if (segments[0] === "profiles") {
    items.push({ label: "Perfiles técnicos (CER)" })
  } else if (segments[0] === "reports") {
    items.push({ label: "Reportes del sistema" })
  } else if (segments[0] === "profile") {
    items.push({ label: "Mi perfil" })
  } else {
    // Fallback for any other protected path
    items.push({
      label: segments[0].charAt(0).toUpperCase() + segments[0].slice(1),
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((crumb, idx) => {
          const isLast = idx === items.length - 1

          return (
            <React.Fragment key={`${crumb.label}-${idx}`}>
              <BreadcrumbItem>
                {isLast || !crumb.href ? (
                  <BreadcrumbPage className="text-foreground max-w-[150px] truncate font-medium sm:max-w-[220px] md:max-w-[320px]">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={crumb.href} />}
                    className="max-w-[120px] truncate sm:max-w-[180px] md:max-w-[240px]"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
