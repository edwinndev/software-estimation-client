"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type LucideIcon, PlusCircleIcon } from "lucide-react"
import Link from "next/link"

interface ProjectItem {
  name: string
  url: string
  icon: LucideIcon
}

export const NavProjects = ({ projects }: { projects: ProjectItem[] }) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Acciones rápidas</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const Icon = item.icon
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton>
                <Link
                  href={item.url}
                  className="flex w-full items-center gap-2"
                >
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Link
              href="/projects/new"
              className="text-primary flex w-full items-center gap-2 font-medium"
            >
              <PlusCircleIcon className="size-4" />
              <span>Nuevo proyecto</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
