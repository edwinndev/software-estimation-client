import { EstimationImpact, RiskLevel } from '../types';

const DEFAULT_MARGINS: Record<RiskLevel, number> = {
  low: 5,
  medium: 15,
  high: 25,
};

export const riskService = {
  getDefaultMargin: (level: RiskLevel): number => {
    return DEFAULT_MARGINS[level];
  },

  calculateImpact: (baseTime: number, baseCost: number, margin: number): EstimationImpact => {
    const factor = margin / 100;
    const contingencyTime = baseTime * factor;
    const contingencyCost = baseCost * factor;

    return {
      originalTime: baseTime,
      originalCost: baseCost,
      contingencyTime,
      contingencyCost,
      totalTime: baseTime + contingencyTime,
      totalCost: baseCost + contingencyCost,
    };
  },

  saveConfig: async (projectId: string, config: any): Promise<void> => {
    localStorage.setItem(`risk_config_${projectId}`, JSON.stringify(config));
    return Promise.resolve();
  }
};
