import { ProjectDetailView } from "@/features/projects"

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { projectId } = await params

  return <ProjectDetailView projectId={projectId} />
}

export default ProjectDetailPage
