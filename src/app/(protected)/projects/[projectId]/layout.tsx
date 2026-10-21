"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { ProjectNavTabs } from "@/components/project-nav-tabs"
import { ProjectLayoutStatus } from "@/features/projects/ui/project-layout-status"

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const isEditPage = pathname.endsWith("/edit")

  if (isEditPage) {
    return <div>{children}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <ProjectNavTabs />
      <ProjectLayoutStatus />
      <div>{children}</div>
    </div>
  )
}

export default ProjectLayout
