import type { PaginatedResponse, PaginationRequest } from "@/types/api"

export const TABLE_PAGE_SIZE = 20

export const paginateQuery = <T, K extends string>(
  items: T[],
  pagination: PaginationRequest,
  key: K
): PaginatedResponse<T, K> => {
  const totalElements = items.length
  const totalPages = Math.ceil(totalElements / pagination.pageSize)
  const lastPage = Math.max(totalPages - 1, 0)
  const pageNumber = Math.min(Math.max(pagination.pageNumber, 0), lastPage)
  const start = pageNumber * pagination.pageSize
  const pageItems = items.slice(start, start + pagination.pageSize)

  return {
    [key]: pageItems,
    pageSize: pagination.pageSize,
    pageNumber,
    totalPages,
    totalElements,
    hasNext: pageNumber < lastPage,
    hasPrevious: pageNumber > 0,
  } as PaginatedResponse<T, K>
}
