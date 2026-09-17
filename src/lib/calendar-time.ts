export const DAYS_PER_WEEK = 7

export const toCalendarDays = (value: number, unit: string) => {
  if (unit === "semanas") {
    return value * DAYS_PER_WEEK
  }
  return value
}

export const timeUnitLabel = (unit: string) => {
  if (unit === "semanas") {
    return "semanas"
  }
  return "días"
}
