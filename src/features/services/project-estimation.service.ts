import type {
  ProjectEstimation,
  ProjectEstimationWithContingency,
  UpdateProjectRiskInput,
} from '../types/risk.types';
import { riskConfigService } from './risk-config.service';

const STORAGE_KEY = 'project-estimations';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

const SEED: ProjectEstimation[] = [
  {
    id: 'p-1',
    name: 'Rediseño portal',
    baseEstimatedHours: 120,
    baseEstimatedCost: 8000,
    riskLevel: 'medium',
    contingencyPercentageOverride: null,
  },
  {
    id: 'p-2',
    name: 'App móvil v1',
    baseEstimatedHours: 300,
    baseEstimatedCost: 22000,
    riskLevel: 'high',
    contingencyPercentageOverride: null,
  },
];

const readAll = (): ProjectEstimation[] => {
  if (typeof window === 'undefined') return SEED;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED;
  }
  try {
    return JSON.parse(raw) as ProjectEstimation[];
  } catch {
    return SEED;
  }
};

const writeAll = (items: ProjectEstimation[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const projectEstimationService = {
  async list(): Promise<ProjectEstimationWithContingency[]> {
    await delay();
    const [config, projects] = await Promise.all([
      riskConfigService.get(),
      Promise.resolve(readAll()),
    ]);

    return projects.map((p) => {
      const base = config.levels[p.riskLevel];
      const applied =
        p.contingencyPercentageOverride ?? base ?? 0;
      const factor = 1 + applied / 100;
      return {
        ...p,
        appliedContingencyPercentage: applied,
        contingencyHours: p.baseEstimatedHours * (applied / 100),
        contingencyCost: p.baseEstimatedCost * (applied / 100),
        adjustedHours: p.baseEstimatedHours * factor,
        adjustedCost: p.baseEstimatedCost * factor,
      };
    });
  },

  async updateRisk(
    input: UpdateProjectRiskInput,
  ): Promise<ProjectEstimation> {
    await delay();
    const all = readAll();
    const idx = all.findIndex((p) => p.id === input.projectId);
    if (idx === -1) throw new Error('Project not found');
    const updated: ProjectEstimation = {
      ...all[idx],
      riskLevel: input.riskLevel,
      contingencyPercentageOverride:
        input.contingencyPercentageOverride ?? null,
    };
    all[idx] = updated;
    writeAll(all);
    return updated;
  },
};