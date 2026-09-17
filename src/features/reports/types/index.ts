export type ReportSnapshot = {
  id: string
  projectId: string
  projectName: string
  projectStatus: string
  projectType: string
  projectOwner: string
  createdAt: string
  baseEffortPoints: number
  totalSprints: number
  totalEffortHours: number
  storiesTotal: number
  storiesWithPoints: number
  tasksTotal: number
  tasksWithHours: number
  baseTime: number
  timeUnit: string
  baseCost: number
  riskLevel: string
  contingencyMarginPercentage: number
  contingencyTime: number
  contingencyCost: number
  totalTime: number
  totalCost: number
}

export type ProjectReportSummary = {
  projectId: string
  projectName: string
  projectStatus: string
  projectType: string
  latestEstimate: ReportSnapshot | null
}

export type GlobalSystemReport = {
  totalProjects: number
  totalEstimatesCompleted: number
  totalSystemStoryPoints: number
  totalSystemBaseTime: number
  totalSystemBaseCost: number
  totalSystemContingencyCost: number
  totalSystemCost: number
  projectSummaries: ProjectReportSummary[]
}
