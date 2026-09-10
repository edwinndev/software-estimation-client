'use client';

import { useProjectEstimations } from '../hooks/use-project-estimations';
import { ContingencyConfigForm } from './contingency-config-form';
import { ProjectEstimationCard } from './project-estimation-card';
import { ContingencySummary } from './contingency-summary';

export const RiskView = () => {
  const { data, isLoading, isError } = useProjectEstimations();

  if (isLoading) return <p>Cargando…</p>;
  if (isError) return <p>Error al cargar proyectos.</p>;

  return (
    <div className="space-y-6">
      <ContingencyConfigForm />
      <ContingencySummary projects={data ?? []} />
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((p) => (
          <ProjectEstimationCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
};