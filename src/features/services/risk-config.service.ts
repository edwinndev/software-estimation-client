import type { RiskConfig } from '../types/risk.types';

const STORAGE_KEY = 'risk-config';

const DEFAULT_CONFIG: RiskConfig = {
  levels: { low: 5, medium: 15, high: 25 },
};

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export const riskConfigService = {
  async get(): Promise<RiskConfig> {
    await delay();
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    try {
      return JSON.parse(raw) as RiskConfig;
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  async save(config: RiskConfig): Promise<RiskConfig> {
    await delay();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return config;
  },
};