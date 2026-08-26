interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Detalle del proyecto</h1>
      <p className="text-sm text-muted-foreground">
        Visualiza y edita los datos generales, estado y responsable del proyecto #{projectId}.
      </p>
    </div>
  );
};

export default ProjectDetailPage;
