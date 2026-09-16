import { Card, CardContent } from "@/components/ui/card"

export const CostsEmptyState = () => {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="font-medium">Aún no hay costos calculados</p>
        <p className="text-muted-foreground mt-1 text-sm">
          El resumen estará disponible cuando existan tareas con horas y
          perfiles técnicos asignados.
        </p>
      </CardContent>
    </Card>
  )
}
