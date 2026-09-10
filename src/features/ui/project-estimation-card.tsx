'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RiskLevelSelector } from './risk-level-selector';
import { useUpdateProjectRisk } from '../hooks/use-project-estimations';
import type {
  ProjectEstimationWithContingency,
  RiskLevel,
} from '../types/risk.types';

interface Props {
  project: ProjectEstimationWithContingency;
}

const fmt = (n: number) => new Intl.NumberFormat('es-PE').format(n);

export const ProjectEstimationCard = ({ project }: Props) => {
  const { mutate, isPending } = useUpdateProjectRisk();

  const handleChange = (riskLevel: RiskLevel) =>
    mutate({ projectId: project.id, riskLevel });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{project.name}</CardTitle>
        <RiskLevelSelector
          value={project.riskLevel}
          onChange={handleChange}
          disabled={isPending}
        />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Horas base</p>
          <p>{fmt(project.baseEstimatedHours)} h</p>
        </div>
        <div>
          <p className="text-muted-foreground">Horas con contingencia</p>
          <p className="font-medium">
            {fmt(project.adjustedHours)} h{' '}
            <span className="text-xs text-muted-foreground">
              (+{project.appliedContingencyPercentage}%)
            </span>
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Costo base</p>
          <p>S/ {fmt(project.baseEstimatedCost)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Costo con contingencia</p>
          <p className="font-medium">
            S/ {fmt(project.adjustedCost)}{' '}
            <span className="text-xs text-muted-foreground">
              (+S/ {fmt(project.contingencyCost)})
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};