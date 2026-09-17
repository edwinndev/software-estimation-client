import { EstimationView } from "@/features/estimates"

interface EstimationPageProps {
  params: Promise<{ projectId: string }>
}

const EstimationPage = async ({ params }: EstimationPageProps) => {
  const { projectId } = await params

  return <EstimationView projectId={projectId} />
}

export default EstimationPage
