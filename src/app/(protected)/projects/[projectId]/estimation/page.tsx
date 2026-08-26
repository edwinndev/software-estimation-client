interface EstimationPageProps {
  params: Promise<{ projectId: string }>
}

const EstimationPage = async ({ params }: EstimationPageProps) => {
  const { projectId } = await params

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Estimación ágil</h1>
      <p className="text-muted-foreground text-sm">
        Calcula sprints, tiempo estimado y asignación de horas de esfuerzo para
        el proyecto #{projectId}.
      </p>
    </div>
  )
}

export default EstimationPage
