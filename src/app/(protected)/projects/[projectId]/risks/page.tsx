interface RisksPageProps {
  params: Promise<{ projectId: string }>
}

const RisksPage = async ({ params }: RisksPageProps) => {
  const { projectId } = await params

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Riesgo y contingencia
      </h1>
      <p className="text-muted-foreground text-sm">
        Configuración de nivel de riesgo y margen de contingencia en tiempo y
        costo para el proyecto #{projectId}.
      </p>
    </div>
  )
}

export default RisksPage
