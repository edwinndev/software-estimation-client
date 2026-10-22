export type ApiErrorBody = {
  code?: number
  message?: string
  cause?: string
  path?: string
  timestamp?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly body: ApiErrorBody | null

  constructor(
    status: number,
    message: string,
    body: ApiErrorBody | null = null
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError && error.message) {
    return error.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
