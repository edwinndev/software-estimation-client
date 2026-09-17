"use client"

import { useState } from "react"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"

export const usePagination = (pageSize = TABLE_PAGE_SIZE) => {
  const [pageNumber, setPageNumber] = useState(0)

  const resetPage = () => {
    setPageNumber(0)
  }

  return {
    pageNumber,
    pageSize,
    setPageNumber,
    resetPage,
  }
}
