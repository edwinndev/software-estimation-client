"use client"

import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { usePagination } from "@/hooks"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"

import {
  FilterOperator,
  type FilterRequest,
  type PaginatedResponse,
  type QueryRequest,
} from "@/types/api"

import { useProjects } from "../hooks/use-projects"
import type { Project, ProjectFilters } from "../types/project-types"

import { ProjectsTable } from "./projects-table"
import { ProjectToolbar } from "./project-toolbar"
import { ProjectsFiltersDrawer } from "./projects-filters-drawer"

const emptyPage: PaginatedResponse<Project, "projectResponse"> = {
  projectResponse: [],
  pageSize: TABLE_PAGE_SIZE,
  pageNumber: 0,
  totalPages: 0,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
}

export const ProjectsView = () => {
  const { pageNumber, pageSize, setPageNumber, resetPage } = usePagination()

  const [search, setSearch] = useState("")

  const [filters, setFilters] = useState<ProjectFilters>({
    nombre: "",
    tipo: "",
    responsable: "",
    estado: "",
  })

  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilters =
    (search.length > 0 ? 1 : 0) +
    (filters.nombre.length > 0 ? 1 : 0) +
    (filters.tipo.length > 0 ? 1 : 0) +
    (filters.responsable.length > 0 ? 1 : 0) +
    (filters.estado.length > 0 ? 1 : 0)

  const apiFilters: FilterRequest[] = []

  if (search.trim()) {
    apiFilters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [search.trim()],
    })
  }

  for (const key of ["nombre", "tipo", "responsable", "estado"] as const) {
    if (filters[key]) {
      apiFilters.push({
        key,
        operator: key === "nombre" ? FilterOperator.LK : FilterOperator.EQ,
        values: [filters[key]],
      })
    }
  }

  const query: QueryRequest = {
    filters: apiFilters,
    pagination: {
      pageNumber,
      pageSize,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  }

  const { paginatedProjects, isLoading } = useProjects(query)

  const pagination = paginatedProjects ?? emptyPage

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <ProjectToolbar
            search={search}
            activeFilters={activeFilters}
            onSearchChange={(value) => {
              setSearch(value)
              resetPage()
            }}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        </CardHeader>

        <CardContent>
          <DataTable
            isLoading={isLoading}
            isError={false}
            errorMessage="No se pudieron cargar los proyectos."
            isEmpty={pagination.projectResponse.length === 0}
            emptyMessage={
              activeFilters > 0
                ? "No hay proyectos que coincidan con los filtros."
                : "Aún no hay proyectos registrados."
            }
            pagination={pagination}
            onPageChange={setPageNumber}
          >
            <ProjectsTable projects={pagination.projectResponse} />
          </DataTable>
        </CardContent>
      </Card>

      <ProjectsFiltersDrawer
        open={filtersOpen}
        filters={filters}
        onOpenChange={setFiltersOpen}
        onApply={(nextFilters) => {
          setFilters(nextFilters)
          resetPage()
        }}
      />
    </div>
  )
}
