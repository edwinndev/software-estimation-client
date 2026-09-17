import { CostsView } from "@/features/costs"

type CostsPageProps = {
  params: Promise<{ projectId: string }>
}

const CostsPage = async ({ params }: CostsPageProps) => {
  const { projectId } = await params

  return <CostsView projectId={projectId} />
}

export default CostsPage
