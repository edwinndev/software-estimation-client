import { StoriesView } from "@/features/stories"

interface BacklogPageProps {
  params: Promise<{ projectId: string }>
}

const BacklogPage = async ({ params }: BacklogPageProps) => {
  const { projectId } = await params

  return <StoriesView projectId={projectId} />
}

export default BacklogPage
