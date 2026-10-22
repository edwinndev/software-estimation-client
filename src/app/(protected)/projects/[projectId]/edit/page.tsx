import { ProjectEditView } from "@/features/projects"

interface ProjectEditPageProps {
  params: Promise<{ projectId: string }>
}

const ProjectEditPage = async ({ params }: ProjectEditPageProps) => {
  const { projectId } = await params

  return <ProjectEditView projectId={projectId} />
}

export default ProjectEditPage
