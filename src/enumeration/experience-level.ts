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
