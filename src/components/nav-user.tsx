"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { usePermissions } from "@/features/auth/hooks/use-permissions"
import {
  getFullName,
  getInitials,
  ROLE_LABELS,
  type Session,
} from "@/features/auth/types"
import {
  ChevronsUpDownIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export const NavUser = ({ user }: { user: Session }) => {
  const { isMobile } = useSidebar()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const fullName = getFullName(user)
  const initials = getInitials(user)
  const { canReadUsers, canReadProfiles } = usePermissions()
  const canManageUsers = canReadUsers
  const canManageProfiles = canReadProfiles

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className="aria-expanded:bg-muted w-full"
              render={<DropdownMenuTrigger />}
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
            <DropdownMenuContent
              className="w-56"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{fullName}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              {canManageUsers || canManageProfiles ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {canManageUsers ? (
                      <DropdownMenuItem>
                        <Link
                          href="/users"
                          className="flex w-full items-center gap-2"
                        >
                          <UserIcon className="size-4" />
                          <span>Perfil y usuarios</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                    {canManageProfiles ? (
                      <DropdownMenuItem>
                        <Link
                          href="/profiles"
                          className="flex w-full items-center gap-2"
                        >
                          <SettingsIcon className="size-4" />
                          <span>Perfiles técnicos</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuGroup>
                </>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
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
