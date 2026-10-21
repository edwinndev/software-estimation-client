import { redirect } from "next/navigation"

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { projectId } = await params

  redirect(`/projects/${projectId}/backlog`)
}

export default ProjectDetailPage
