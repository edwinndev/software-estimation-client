interface BacklogPageProps {
  params: Promise<{ projectId: string }>;
}

const BacklogPage = async ({ params }: BacklogPageProps) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Historias de usuario y tareas</h1>
      <p className="text-sm text-muted-foreground">
        Gestiona el backlog de historias y desglose de tareas técnicas para el proyecto #{projectId}.
      </p>
    </div>
  );
};

export default BacklogPage;
