"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { useDebounce, usePagination } from "@/hooks"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import {
  FilterOperator,
  type FilterRequest,
  type QueryRequest,
} from "@/types/api"
import { usePermissions } from "@/features/auth/hooks/use-permissions"
import { useUsers } from "../hooks/use-users"
import type { User, UserFilters, UserSearchResponse } from "../types"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UsersFiltersDrawer } from "./users-filters-drawer"
import { UsersTable } from "./users-table"
import { UsersToolbar } from "./users-toolbar"

const emptyPage: UserSearchResponse = {
  userResponse: [],
  pageSize: TABLE_PAGE_SIZE,
  pageNumber: 0,
  totalPages: 0,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
}

export const UsersView = () => {
  const { pageNumber, pageSize, setPageNumber, resetPage } = usePagination()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<UserFilters>({
    firstName: "",
    email: "",
    role: "",
  })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const debouncedSearch = useDebounce(search, 500)
  const hasFilters =
    debouncedSearch.length > 0 ||
    filters.firstName.length > 0 ||
    filters.email.length > 0 ||
    filters.role.length > 0
  const activeFilters =
    (search.length > 0 ? 1 : 0) +
    (filters.firstName.length > 0 ? 1 : 0) +
    (filters.email.length > 0 ? 1 : 0) +
    (filters.role.length > 0 ? 1 : 0)

  const apiFilters: FilterRequest[] = []

  if (debouncedSearch.trim().length > 0) {
    apiFilters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [debouncedSearch.trim()],
    })
  }

  if (filters.firstName.length > 0) {
    apiFilters.push({
      key: "firstName",
      operator: FilterOperator.LK,
      values: [filters.firstName],
    })
  }

  if (filters.email.length > 0) {
    apiFilters.push({
      key: "email",
      operator: FilterOperator.LK,
      values: [filters.email],
    })
  }

  if (filters.role.length > 0) {
    apiFilters.push({
      key: "role",
      operator: FilterOperator.EQ,
      values: [filters.role],
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

  const { data, isLoading, isError } = useUsers(query)
  const pagination = data || emptyPage
  const { canWriteUsers } = usePermissions()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de usuarios
          </h1>
          <p className="text-muted-foreground text-sm">
            Crea, edita y elimina las cuentas internas de la plataforma.
          </p>
        </div>
        {canWriteUsers ? (
          <Link href="/users/new" className={buttonVariants()}>
            <PlusIcon />
            Nuevo usuario
          </Link>
        ) : null}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <UsersToolbar
            search={search}
            activeFilters={activeFilters}
            onSearchChange={(value) => {
              setSearch(value)
              resetPage()
            }}
            onOpenFilters={() => setFiltersOpen(true)}
          />
          <DataTable
            isLoading={isLoading}
            isError={isError}
            errorMessage="No se pudieron cargar los usuarios."
            isEmpty={pagination.userResponse.length === 0}
            emptyMessage={
              hasFilters
                ? "No hay usuarios que coincidan con los filtros."
                : "Aún no hay usuarios registrados."
            }
            pagination={pagination}
            onPageChange={setPageNumber}
          >
            <UsersTable
              users={pagination.userResponse}
              onDelete={setDeletingUser}
            />
          </DataTable>
        </CardContent>
      </Card>

      <UsersFiltersDrawer
        open={filtersOpen}
        filters={filters}
        onOpenChange={setFiltersOpen}
        onApply={(nextFilters) => {
          setFilters(nextFilters)
          resetPage()
        }}
      />

      <UserDeleteDialog
        open={Boolean(deletingUser)}
        user={deletingUser}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingUser(null)
          }
        }}
      />
    </div>
  )
}
