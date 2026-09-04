import { ProjectHistoryView } from "@/features/projects/ui/project-history-view"

interface HistoryPageProps {
  params: Promise<{ projectId: string }>
}

const HistoryPage = async ({ params }: HistoryPageProps) => {
  const { projectId } = await params

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Historial y auditoría
        </h1>
        <p className="text-muted-foreground text-sm">
          Registro cronológico de cambios de estado para el proyecto #
          {projectId}.
        </p>
      </div>

      <ProjectHistoryView projectId={projectId} />
    </div>
  )
}

export default HistoryPage
