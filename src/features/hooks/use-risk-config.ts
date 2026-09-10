'use client'; 

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { riskConfigService } from '../services/risk-config.service';
import type { RiskConfig } from '../types/risk.types';

export const riskConfigKeys = {
  all: ['risk-config'] as const,
};

export const useRiskConfig = () =>
  useQuery({
    queryKey: riskConfigKeys.all,
    queryFn: () => riskConfigService.get(),
  });

export const useUpdateRiskConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (config: RiskConfig) => riskConfigService.save(config),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: riskConfigKeys.all });
    },
  });
};