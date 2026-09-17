import type { ReportSnapshot } from "../types"

const toNumber = (value: unknown, fallback: number) => {
  const parsed = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(parsed)) {
    return fallback
  }
  return parsed
}

const toText = (value: unknown, fallback: string) => {
  if (typeof value === "string") {
    return value
  }
  return fallback
}

export const emptySnapshot = (projectId: string): ReportSnapshot => {
  return {
    id: "",
    projectId,
    projectName: "",
    projectStatus: "",
    projectType: "",
    projectOwner: "",
    createdAt: "",
    baseEffortPoints: 0,
    totalSprints: 0,
    totalEffortHours: 0,
    storiesTotal: 0,
    storiesWithPoints: 0,
    tasksTotal: 0,
    tasksWithHours: 0,
    baseTime: 0,
    timeUnit: "dias",
    baseCost: 0,
    riskLevel: "medium",
    contingencyMarginPercentage: 15,
    contingencyTime: 0,
    contingencyCost: 0,
    totalTime: 0,
    totalCost: 0,
  }
}

export const normalizeSnapshot = (
  value: unknown,
  projectId: string
): ReportSnapshot => {
  const fallback = emptySnapshot(projectId)
  if (!value || typeof value !== "object") {
    return fallback
  }
  const raw = value as Record<string, unknown>
  return {
    id: toText(raw.id, fallback.id),
    projectId: toText(raw.projectId, projectId),
    projectName: toText(raw.projectName, fallback.projectName),
    projectStatus: toText(raw.projectStatus, fallback.projectStatus),
    projectType: toText(raw.projectType, fallback.projectType),
    projectOwner: toText(raw.projectOwner, fallback.projectOwner),
    createdAt: toText(raw.createdAt, fallback.createdAt),
    baseEffortPoints: toNumber(raw.baseEffortPoints, 0),
    totalSprints: toNumber(raw.totalSprints, 0),
    totalEffortHours: toNumber(raw.totalEffortHours, 0),
    storiesTotal: toNumber(raw.storiesTotal, 0),
    storiesWithPoints: toNumber(raw.storiesWithPoints, 0),
    tasksTotal: toNumber(raw.tasksTotal, 0),
    tasksWithHours: toNumber(raw.tasksWithHours, 0),
    baseTime: toNumber(raw.baseTime, 0),
    timeUnit: toText(raw.timeUnit, "dias"),
    baseCost: toNumber(raw.baseCost, 0),
    riskLevel: toText(raw.riskLevel, "medium"),
    contingencyMarginPercentage: toNumber(raw.contingencyMarginPercentage, 15),
    contingencyTime: toNumber(raw.contingencyTime, 0),
    contingencyCost: toNumber(raw.contingencyCost, 0),
    totalTime: toNumber(raw.totalTime, 0),
    totalCost: toNumber(raw.totalCost, 0),
  }
}
