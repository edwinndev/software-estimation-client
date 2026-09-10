export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskLevelConfig {
  level: RiskLevel;
  contingencyPercentage: number;
}

export interface RiskConfig {
  levels: Record<RiskLevel, number>; // low: 5, medium: 15, high: 25
}

export interface ProjectEstimation {
  id: string;
  name: string;
  baseEstimatedHours: number;
  baseEstimatedCost: number;
  riskLevel: RiskLevel;
  contingencyPercentageOverride?: number | null;
}

export interface ProjectEstimationWithContingency extends ProjectEstimation {
  appliedContingencyPercentage: number;
  contingencyHours: number;
  contingencyCost: number;
  adjustedHours: number;
  adjustedCost: number;
}

export interface UpdateProjectRiskInput {
  projectId: string;
  riskLevel: RiskLevel;
  contingencyPercentageOverride?: number | null;
}