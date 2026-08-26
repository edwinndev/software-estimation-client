interface HistoryPageProps {
  params: Promise<{ projectId: string }>;
}

const HistoryPage = async ({ params }: HistoryPageProps) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Historial y auditoría</h1>
      <p className="text-sm text-muted-foreground">
        Registro cronológico de cambios de estado y versiones de estimaciones para el proyecto #{projectId}.
      </p>
    </div>
  );
};

export default HistoryPage;
