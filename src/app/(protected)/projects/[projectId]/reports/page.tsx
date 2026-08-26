interface ReportsPageProps {
  params: Promise<{ projectId: string }>;
}

const ReportsPage = async ({ params }: ReportsPageProps) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Reportes y análisis</h1>
      <p className="text-sm text-muted-foreground">
        Visualización consolidada de estimaciones base vs contingencia y exportación de reportes para el proyecto #{projectId}.
      </p>
    </div>
  );
};

export default ReportsPage;
