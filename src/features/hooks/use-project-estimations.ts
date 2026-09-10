'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectEstimationService } from '../services/project-estimation.service';
import type { UpdateProjectRiskInput } from '../types/risk.types';
import { riskConfigKeys } from './use-risk-config';

export const projectEstimationKeys = {
  all: ['project-estimations'] as const,
};

export const useProjectEstimations = () =>
  useQuery({
    queryKey: projectEstimationKeys.all,
    queryFn: () => projectEstimationService.list(),
  });

export const useUpdateProjectRisk = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectRiskInput) =>
      projectEstimationService.updateRisk(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectEstimationKeys.all });
      qc.invalidateQueries({ queryKey: riskConfigKeys.all });
    },
  });
};