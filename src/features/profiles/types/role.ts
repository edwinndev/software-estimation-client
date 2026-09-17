import {
  Activity,
  CheckCircle2Icon,
  Cpu,
  FileTextIcon,
  Flag,
  Layers,
  Server,
  Sliders,
  SparklesIcon,
  UserRound,
  type LucideIcon,
} from "lucide-react"

export type TechnicalRoleDefinition = {
  value: string
  label: string
  icon: LucideIcon
  color: string
}

export const TechnicalRole = {
  FRONTEND: {
    value: "Frontend",
    label: "Frontend",
    icon: Cpu,
    color: "text-blue-500",
  },
  BACKEND: {
    value: "Backend",
    label: "Backend",
    icon: Server,
    color: "text-emerald-500",
  },
  FULLSTACK: {
    value: "Fullstack",
    label: "Fullstack",
    icon: Layers,
    color: "text-cyan-500",
  },
  QA: {
    value: "QA",
    label: "QA / Testing",
    icon: CheckCircle2Icon,
    color: "text-amber-500",
  },
  DEVOPS: {
    value: "DevOps",
    label: "DevOps / Infraestructura",
    icon: Activity,
    color: "text-purple-500",
  },
  UI_UX_DESIGNER: {
    value: "UI/UX Designer",
    label: "Diseñador UI/UX",
    icon: SparklesIcon,
    color: "text-rose-500",
  },
  PRODUCT_MANAGER: {
    value: "Product Manager",
    label: "Product Manager",
    icon: UserRound,
    color: "text-blue-500",
  },
  TECH_LEAD: {
    value: "Tech Lead",
    label: "Líder Técnico",
    icon: Flag,
    color: "text-purple-500",
  },
  FUNCTIONAL_ANALYST: {
    value: "Functional Analyst",
    label: "Analista Funcional",
    icon: FileTextIcon,
    color: "text-amber-500",
  },
  OTHER: {
    value: "Other",
    label: "Otro",
    icon: Sliders,
    color: "text-muted-foreground",
  },
} as const satisfies Record<string, TechnicalRoleDefinition>

export const TECHNICAL_ROLES = [
  TechnicalRole.FRONTEND.value,
  TechnicalRole.BACKEND.value,
  TechnicalRole.FULLSTACK.value,
  TechnicalRole.QA.value,
  TechnicalRole.DEVOPS.value,
  TechnicalRole.UI_UX_DESIGNER.value,
  TechnicalRole.PRODUCT_MANAGER.value,
  TechnicalRole.TECH_LEAD.value,
  TechnicalRole.FUNCTIONAL_ANALYST.value,
  TechnicalRole.OTHER.value,
] as const

export type TechnicalRoleValue = (typeof TECHNICAL_ROLES)[number]
export type TechnicalRoleType = TechnicalRoleValue

export const TECHNICAL_ROLE_OPTIONS = Object.values(TechnicalRole)

export type ExperienceLevelDefinition = {
  value: string
  label: string
}

export const ExperienceLevel = {
  JUNIOR: {
    value: "Junior",
    label: "Junior (0-2 años)",
  },
  MID: {
    value: "Mid",
    label: "Semi-Senior (2-5 años)",
  },
  SENIOR: {
    value: "Senior",
    label: "Senior (5+ años)",
  },
  LEAD: {
    value: "Lead",
    label: "Líder / Principal",
  },
} as const satisfies Record<string, ExperienceLevelDefinition>

export const EXPERIENCE_LEVELS = [
  ExperienceLevel.JUNIOR.value,
  ExperienceLevel.MID.value,
  ExperienceLevel.SENIOR.value,
  ExperienceLevel.LEAD.value,
] as const

export type ExperienceLevelValue = (typeof EXPERIENCE_LEVELS)[number]
export type ExperienceLevelType = ExperienceLevelValue

export const EXPERIENCE_LEVEL_OPTIONS = Object.values(ExperienceLevel)
