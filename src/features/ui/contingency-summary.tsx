import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectEstimationWithContingency } from '../types/risk.types';

interface Props {
  projects: ProjectEstimationWithContingency[];
}

export const ContingencySummary = ({ projects }: Props) => {
  const totalBase = projects.reduce((s, p) => s + p.baseEstimatedCost, 0);
  const totalAdjusted = projects.reduce((s, p) => s + p.adjustedCost, 0);
  const delta = totalAdjusted - totalBase;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de contingencia</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p>Costo base total: S/ {totalBase.toLocaleString('es-PE')}</p>
        <p>Costo ajustado total: S/ {totalAdjusted.toLocaleString('es-PE')}</p>
        <p className="font-medium">
          Margen total aplicado: S/ {delta.toLocaleString('es-PE')}
        </p>
      </CardContent>
    </Card>
  );
};