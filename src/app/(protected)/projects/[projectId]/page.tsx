import { ProjectDetailView } from "@/features/projects"

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { projectId } = await params

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Detalle del proyecto
        </h1>
        <p className="text-muted-foreground">
          Visualiza y administra los datos generales, estado y responsable del
          proyecto.
        </p>
      </div>
      <ProjectDetailView projectId={projectId} />
    </div>
  )
}

export default ProjectDetailPage
