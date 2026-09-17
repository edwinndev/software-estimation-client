export interface ReportSnapshot {
  id: string
  projectId: string
  createdAt: string

  // Base Estimate
  baseEffortPoints: number
  baseTime: number // en la unidad de tiempo (días o semanas)
  timeUnit: string
  baseCost: number

  // Risk & Contingency
  riskLevel: string
  contingencyMarginPercentage: number

  // Impact
  contingencyTime: number
  contingencyCost: number

  // Totals
  totalTime: number
  totalCost: number
}

export interface ProjectReportSummary {
  projectId: string
  projectName: string
  projectStatus: string
  latestEstimate: ReportSnapshot | null
}

export interface GlobalSystemReport {
  totalProjects: number
  totalEstimatesCompleted: number
  totalSystemStoryPoints: number
  totalSystemBaseTime: number // en días (convertido si aplica)
  totalSystemBaseCost: number
  totalSystemContingencyCost: number
  totalSystemCost: number
  projectSummaries: ProjectReportSummary[]
}
