import {
  AlertTriangleIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react"

export type RiskLevelDefinition = {
  value: string
  label: string
  icon: LucideIcon
  color: string
  buttonClassName: string
  defaultMargin: number
}

export const RiskLevelEnum = {
  LOW: {
    value: "low",
    label: "Bajo",
    icon: ShieldCheckIcon,
    color: "text-emerald-600",
    buttonClassName: "bg-emerald-500 hover:bg-emerald-600 text-white",
    defaultMargin: 5,
  },
  MEDIUM: {
    value: "medium",
    label: "Medio",
    icon: AlertTriangleIcon,
    color: "text-amber-600",
    buttonClassName: "bg-yellow-500 hover:bg-yellow-600 text-white",
    defaultMargin: 15,
  },
  HIGH: {
    value: "high",
    label: "Alto",
    icon: ShieldAlertIcon,
    color: "text-red-600",
    buttonClassName: "bg-red-500 hover:bg-red-600 text-white",
    defaultMargin: 25,
  },
} as const satisfies Record<string, RiskLevelDefinition>

export const RISK_LEVELS = [
  RiskLevelEnum.LOW.value,
  RiskLevelEnum.MEDIUM.value,
  RiskLevelEnum.HIGH.value,
] as const

export type RiskLevel = (typeof RISK_LEVELS)[number]

export const RISK_LEVEL_OPTIONS = [
  RiskLevelEnum.LOW,
  RiskLevelEnum.MEDIUM,
  RiskLevelEnum.HIGH,
]

export const RISK_LEVEL_BY_VALUE = {
  [RiskLevelEnum.LOW.value]: RiskLevelEnum.LOW,
  [RiskLevelEnum.MEDIUM.value]: RiskLevelEnum.MEDIUM,
  [RiskLevelEnum.HIGH.value]: RiskLevelEnum.HIGH,
} as const

export const RISK_LEVEL_LABELS = {
  [RiskLevelEnum.LOW.value]: RiskLevelEnum.LOW.label,
  [RiskLevelEnum.MEDIUM.value]: RiskLevelEnum.MEDIUM.label,
  [RiskLevelEnum.HIGH.value]: RiskLevelEnum.HIGH.label,
} as const

export const DEFAULT_RISK_LEVEL = RiskLevelEnum.MEDIUM.value

export const isRiskLevel = (value: unknown): value is RiskLevel =>
  RISK_LEVELS.some((level) => level === value)

export const getRiskDefaultMargin = (level: RiskLevel): number =>
  RISK_LEVEL_BY_VALUE[level].defaultMargin
