export type PaginationMeta = {
  pageSize: number
  pageNumber: number
  totalPages: number
  totalElements: number
  hasNext: boolean
  hasPrevious: boolean
}

export type PaginatedResponse<T, K extends string> = {
  [P in K]: T[]
} & PaginationMeta
