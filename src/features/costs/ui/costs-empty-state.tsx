import { Card, CardContent } from "@/components/ui/card"

export const CostsEmptyState = () => {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="font-medium">Aún no hay costos calculados</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Crea tareas con perfiles en Historias y tareas, asigna horas en
          Estimación y registra el CER de cada perfil. El costo se calcula solo.
        </p>
      </CardContent>
    </Card>
  )
}
