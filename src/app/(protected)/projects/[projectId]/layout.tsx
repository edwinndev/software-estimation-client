import { ProjectNavTabs } from "@/components/project-nav-tabs"

interface ProjectLayoutProps {
  children: React.ReactNode
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return (
    <div className="flex flex-col gap-6">
      <ProjectNavTabs />
      <div>{children}</div>
    </div>
  )
}

export default ProjectLayout
