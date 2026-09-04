"use client"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import type { PaginationMeta } from "@/types/api"

type DataTablePaginationProps = {
  pagination: PaginationMeta
  onPageChange: (pageNumber: number) => void
}

export const DataTablePagination = ({
  pagination,
  onPageChange,
}: DataTablePaginationProps) => {
  const {
    pageNumber,
    pageSize,
    totalPages,
    totalElements,
    hasNext,
    hasPrevious,
  } = pagination
  const from = totalElements === 0 ? 0 : pageNumber * pageSize + 1
  const to = Math.min((pageNumber + 1) * pageSize, totalElements)
  const pages = Array.from({ length: totalPages }, (_, index) => index)

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-muted-foreground text-sm">
        {totalElements} {totalElements === 1 ? "registro" : "registros"} en
        total
      </p>

      <div className="flex items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Mostrando {from}-{to} de {totalElements}
        </p>

        {totalPages > 1 ? (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!hasPrevious}
                  onClick={() => onPageChange(pageNumber - 1)}
                >
                  Anterior
                </Button>
              </PaginationItem>

              {pages.map((item) => (
                <PaginationItem key={item}>
                  <Button
                    type="button"
                    variant={item === pageNumber ? "outline" : "ghost"}
                    size="icon-sm"
                    onClick={() => onPageChange(item)}
                  >
                    {item + 1}
                  </Button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!hasNext}
                  onClick={() => onPageChange(pageNumber + 1)}
                >
                  Siguiente
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  )
}
