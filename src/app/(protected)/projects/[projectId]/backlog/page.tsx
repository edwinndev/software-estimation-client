import { BacklogView } from "@/features/backlog"

interface BacklogPageProps {
  params: Promise<{ projectId: string }>
}

const BacklogPage = async ({ params }: BacklogPageProps) => {
  const { projectId } = await params

  return <BacklogView projectId={projectId} />
}

export default BacklogPage
