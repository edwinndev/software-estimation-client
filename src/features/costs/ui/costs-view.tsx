interface CostsViewProps {
  projectId: string
}

export const CostsView = ({ projectId }: CostsViewProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Cálculo de costos</h1>
      <p className="text-muted-foreground text-sm">
        Desglose de costos totales y por perfil técnico (CER) para el proyecto #
        {projectId}.
      </p>
    </div>
  )
}
