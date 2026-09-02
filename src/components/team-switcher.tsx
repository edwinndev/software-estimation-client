"use client"

import Image from "next/image"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export const TeamSwitcher = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Link href="/projects" className="flex w-full items-center gap-3">
            <Image
              src="/logo/Isotype.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-lg"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Intecx Industries</span>
              <span className="text-muted-foreground truncate text-xs">
                Software estimation
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
