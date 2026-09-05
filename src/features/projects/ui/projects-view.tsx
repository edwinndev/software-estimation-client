"use client"

import { DataTable } from "@/components/data-table"
import { usePagination } from "@/hooks"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import { QueryRequest, PaginatedResponse } from "@/types/api"
import { useProjects } from "../hooks/use-projects"
import type { Project } from "../types/project-types"
import { ProjectsTable } from "./projects-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const { pageNumber, pageSize, setPageNumber } = usePagination()

  const query: QueryRequest = {
    filters: [],
    pagination: {
      pageNumber,
      pageSize,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  }

  const { paginatedProjects, isLoading } = useProjects(query)
  const pagination = paginatedProjects || emptyPage

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Listado de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            isLoading={isLoading}
            isError={false}
            errorMessage="No se pudieron cargar los proyectos."
            isEmpty={pagination.projectResponse.length === 0}
            emptyMessage="Aún no hay proyectos registrados."
            pagination={pagination}
            onPageChange={setPageNumber}
          >
            <ProjectsTable projects={pagination.projectResponse} />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  )
}
