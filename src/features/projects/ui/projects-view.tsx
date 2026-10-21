"use client"

import { useState } from "react"
import Link from "next/link"
import { FolderKanbanIcon, PlusIcon } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { buttonVariants } from "@/components/ui/button"

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
    fecha_inicio: "",
    fecha_fin: "",
  })

  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilters =
    (search.length > 0 ? 1 : 0) +
    (filters.nombre.length > 0 ? 1 : 0) +
    (filters.tipo.length > 0 ? 1 : 0) +
    (filters.responsable.length > 0 ? 1 : 0) +
    (filters.estado.length > 0 ? 1 : 0) +
    (filters.fecha_inicio.length > 0 ? 1 : 0) +
    (filters.fecha_fin.length > 0 ? 1 : 0)

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

  if (filters.fecha_inicio) {
    apiFilters.push({
      key: "fecha_inicio",
      operator: FilterOperator.GE,
      values: [filters.fecha_inicio],
    })
  }

  if (filters.fecha_fin) {
    apiFilters.push({
      key: "fecha_fin",
      operator: FilterOperator.LE,
      values: [filters.fecha_fin],
    })
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
      <div className="flex flex-col gap-3">
        <ProjectToolbar
          search={search}
          activeFilters={activeFilters}
          filters={filters}
          onSearchChange={(value) => {
            setSearch(value)
            resetPage()
          }}
          onOpenFilters={() => setFiltersOpen(true)}
          onRemoveFilter={(key) => {
            setFilters((prev) => ({ ...prev, [key]: "" }))
            resetPage()
          }}
          actions={
            <Link
              href="/projects/new"
              className={buttonVariants({ className: "shrink-0" })}
            >
              <PlusIcon />
              Nuevo proyecto
            </Link>
          }
        />

        <DataTable
          isLoading={isLoading}
          isError={false}
          errorMessage="No se pudieron cargar los proyectos."
          isEmpty={pagination.projectResponse.length === 0}
          emptyIcon={FolderKanbanIcon}
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
      </div>

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
