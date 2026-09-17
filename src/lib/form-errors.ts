export const getFieldError = (errors: unknown[]): string => {
  if (errors.length === 0) {
    return ""
  }

  const error = errors[0]
  if (typeof error === "string") {
    return error
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message
    if (typeof message === "string") {
      return message
    }
  }

  return ""
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
