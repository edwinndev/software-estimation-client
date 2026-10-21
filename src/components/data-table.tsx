"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { PaginationMeta } from "@/types/api"
import { DataTablePagination } from "./data-table-pagination"
import { TableEmptyState } from "./table-empty-state"

type DataTableProps = {
  children: ReactNode
  isLoading: boolean
  isError: boolean
  errorMessage: string
  isEmpty: boolean
  emptyMessage: string
  emptyIcon?: LucideIcon
  pagination: PaginationMeta
  onPageChange: (pageNumber: number) => void
}

export const DataTable = ({
  children,
  isLoading,
  isError,
  errorMessage,
  isEmpty,
  emptyMessage,
  emptyIcon,
  pagination,
  onPageChange,
}: DataTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (isError) {
    return <p className="text-destructive text-sm">{errorMessage}</p>
  }

  if (isEmpty) {
    return <TableEmptyState message={emptyMessage} icon={emptyIcon} />
  }

  return (
    <div className="flex flex-col gap-4">
      {children}
      <DataTablePagination
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  )
}
