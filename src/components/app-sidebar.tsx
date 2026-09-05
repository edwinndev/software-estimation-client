"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { usePermissions } from "@/features/auth/hooks/use-permissions"
import { useSession } from "@/features/auth/hooks/use-session"
import { PERMISSIONS } from "@/features/auth/constants/permissions"
import {
  FolderKanbanIcon,
  ListTodoIcon,
  CalculatorIcon,
  DollarSignIcon,
  ShieldAlertIcon,
  FileBarChartIcon,
  HistoryIcon,
  LayersIcon,
  UsersIcon,
} from "lucide-react"

// Items de menú directo para cada uno de los 8 módulos/features
const projectModules = [
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderKanbanIcon,
  },
  {
    title: "Historias y tareas",
    url: "/projects/1/backlog",
    icon: ListTodoIcon,
  },
  {
    title: "Estimación ágil",
    url: "/projects/1/estimation",
    icon: CalculatorIcon,
  },
  {
    title: "Cálculo de costos",
    url: "/projects/1/costs",
    icon: DollarSignIcon,
  },
  {
    title: "Riesgos y contingencia",
    url: "/projects/1/risks",
    icon: ShieldAlertIcon,
  },
  {
    title: "Reportes y análisis",
    url: "/projects/1/reports",
    icon: FileBarChartIcon,
  },
  {
    title: "Historial y auditoría",
    url: "/projects/1/history",
    icon: HistoryIcon,
  },
]

const administrationModules = [
  {
    title: "Perfiles técnicos (CER)",
    url: "/profiles",
    icon: LayersIcon,
    permission: PERMISSIONS.PROFILE_READ,
  },
  {
    title: "Gestión de usuarios",
    url: "/users",
    icon: UsersIcon,
    permission: PERMISSIONS.USER_READ,
  },
]

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { hasPermission } = usePermissions()
  const visibleAdministration = administrationModules.filter((item) =>
    hasPermission(item.permission)
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {/* Módulos de Estimación */}
        <SidebarGroup>
          <SidebarGroupLabel>Módulos de estimación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectModules.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/projects" && pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.url} />}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleAdministration.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleAdministration.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.url || pathname.startsWith(item.url)

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link
                          href={item.url}
                          className="flex w-full items-center gap-3"
                        >
                          <Icon className="size-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        {session ? <NavUser user={session} /> : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
