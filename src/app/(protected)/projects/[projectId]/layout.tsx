import type { ReactNode } from "react"
import { ProjectNavTabs } from "@/components/project-nav-tabs"
import { ProjectLayoutStatus } from "@/features/projects/ui/project-layout-status"

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-6">
      <ProjectNavTabs />
      <ProjectLayoutStatus />
      <div>{children}</div>
    </div>
  )
}

export default ProjectLayout
