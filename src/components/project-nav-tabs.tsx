"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
  FolderIcon,
  ListTodoIcon,
  CalculatorIcon,
  DollarSignIcon,
  ShieldAlertIcon,
  FileBarChartIcon,
  HistoryIcon,
} from "lucide-react"

export const ProjectNavTabs = () => {
  const pathname = usePathname()
  const params = useParams()
  const projectId = params?.projectId as string

  const tabs = [
    {
      title: "General",
      href: `/projects/${projectId}`,
      icon: FolderIcon,
      exact: true,
    },
    {
      title: "Backlog y tareas",
      href: `/projects/${projectId}/backlog`,
      icon: ListTodoIcon,
    },
    {
      title: "Estimación ágil",
      href: `/projects/${projectId}/estimation`,
      icon: CalculatorIcon,
    },
    {
      title: "Costos CER",
      href: `/projects/${projectId}/costs`,
      icon: DollarSignIcon,
    },
    {
      title: "Riesgos",
      href: `/projects/${projectId}/risks`,
      icon: ShieldAlertIcon,
    },
    {
      title: "Reportes",
      href: `/projects/${projectId}/reports`,
      icon: FileBarChartIcon,
    },
    {
      title: "Historial",
      href: `/projects/${projectId}/history`,
      icon: HistoryIcon,
    },
  ]

  return (
    <nav className="flex flex-wrap items-center gap-1 border-b pb-2 text-sm font-medium">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`)

        return (
          <Link
            key={tab.title}
            href={tab.href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            <span>{tab.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
