import { startOfDay } from "date-fns"
import type { RefinementCtx } from "zod"

export const DATE_RANGE_REQUIRED_MESSAGE = "Selecciona una fecha"
export const DATE_RANGE_INVALID_MESSAGE =
  "La fecha de fin no puede ser anterior a la de inicio"

export const isDateBefore = (left: Date, right: Date) =>
  startOfDay(left).getTime() < startOfDay(right).getTime()

export const refineDateRange = (
  ctx: RefinementCtx,
  start: Date | undefined,
  end: Date | undefined,
  paths: { start: (string | number)[]; end: (string | number)[] },
  options?: { required?: boolean }
) => {
  const required = options?.required ?? true

  if (required && !start) {
    ctx.addIssue({
      code: "custom",
      message: DATE_RANGE_REQUIRED_MESSAGE,
      path: paths.start,
    })
  }

  if (required && !end) {
    ctx.addIssue({
      code: "custom",
      message: DATE_RANGE_REQUIRED_MESSAGE,
      path: paths.end,
    })
  }

  if (start && end && isDateBefore(end, start)) {
    ctx.addIssue({
      code: "custom",
      message: DATE_RANGE_INVALID_MESSAGE,
      path: paths.end,
    })
  }
}
