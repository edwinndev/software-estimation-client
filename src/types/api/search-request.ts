export type SortDirection = "ASC" | "DESC"

export const FilterOperator = {
  EQ: "EQ",
  NE: "NE",
  LK: "LK",
  IN: "IN",
  GT: "GT",
  LT: "LT",
  GE: "GE",
  LE: "LE",
  BT: "BT",
} as const

export type FilterOperatorValue =
  (typeof FilterOperator)[keyof typeof FilterOperator]

export type FilterRequest = {
  key: string
  operator: FilterOperatorValue
  values: string[]
}

export type PaginationRequest = {
  orderBy: string
  pageSize: number
  pageNumber: number
  sortDirection: SortDirection
}

export type QueryRequest = {
  filters: FilterRequest[]
  pagination: PaginationRequest
}
