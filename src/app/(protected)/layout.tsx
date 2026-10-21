import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RequireAuth } from "@/features/auth/ui/require-auth"

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RequireAuth>
      <SidebarProvider className="h-svh overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-h-0 overflow-hidden">
          <header className="bg-background flex h-12 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <AppBreadcrumb />
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  )
}

export default ProtectedLayout
