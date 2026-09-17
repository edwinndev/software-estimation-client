import { RisksView } from "@/features/risks"

type RisksPageProps = {
  params: Promise<{ projectId: string }>
}

const RisksPage = async ({ params }: RisksPageProps) => {
  const { projectId } = await params

  return <RisksView projectId={projectId} />
}

export default RisksPage
