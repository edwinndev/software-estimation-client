export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskConfig {
  level: RiskLevel;
  contingencyMargin: number;
}

export interface EstimationImpact {
  originalTime: number;
  originalCost: number;
  contingencyTime: number;
  contingencyCost: number;
  totalTime: number;
  totalCost: number;
}
