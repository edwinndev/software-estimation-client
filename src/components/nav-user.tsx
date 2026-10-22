"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogoutDialog } from "@/features/auth/ui/logout-dialog"
import { useUserAvatar } from "@/features/auth/hooks/use-user-avatar"
import {
  getFullName,
  getInitials,
  ROLE_LABELS,
  type Session,
} from "@/features/auth/types"
import { ChevronsUpDownIcon, UserIcon, LogOutIcon } from "lucide-react"

export const NavUser = ({ user }: { user: Session }) => {
  const { isMobile } = useSidebar()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const { avatar } = useUserAvatar(user.userId)

  const fullName = getFullName(user)
  const initials = getInitials(user)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
              render={<DropdownMenuTrigger />}
            >
              <Avatar className="border-sidebar-border size-8 rounded-md border">
                {avatar ? (
                  <AvatarImage
                    src={avatar}
                    alt={fullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground rounded-md font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-sidebar-foreground truncate font-medium">
                  {fullName}
                </span>
                <span className="text-sidebar-foreground/75 truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDownIcon className="text-sidebar-foreground/75 ml-auto size-4" />
            </SidebarMenuButton>

            <DropdownMenuContent
              className="dark bg-sidebar text-sidebar-foreground border-sidebar-border w-56 border shadow-xl ring-0"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="border-sidebar-border size-8 rounded-md border">
                      {avatar ? (
                        <AvatarImage
                          src={avatar}
                          alt={fullName}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground rounded-md font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="text-sidebar-foreground truncate font-medium">
                        {fullName}
                      </span>
                      <span className="text-sidebar-foreground/70 truncate text-xs">
                        {user.roleName || ROLE_LABELS[user.role]}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-sidebar-border" />

              <DropdownMenuItem
                className="text-sidebar-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer"
                render={
                  <Link
                    href="/profile"
                    className="flex w-full items-center gap-2"
                  />
                }
              >
                <UserIcon className="size-4" />
                <span>Mi perfil</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-sidebar-border" />

              <DropdownMenuItem
                variant="destructive"
                className="focus:bg-destructive/20 focus:text-destructive text-destructive cursor-pointer"
                onClick={() => setIsLogoutOpen(true)}
              >
                <LogOutIcon className="size-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <LogoutDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
    </>
  )
}
