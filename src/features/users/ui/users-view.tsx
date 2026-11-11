"use client"

import { useState } from "react"
import { PlusIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { ResendInvitationDialog } from "./resend-invitation-dialog"
import { ToggleUserStatusDialog } from "./toggle-user-status-dialog"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UserDialog } from "./user-dialog"
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [resendingUser, setResendingUser] = useState<User | null>(null)
  const [togglingStatusUser, setTogglingStatusUser] = useState<User | null>(null)

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

  const handleOpenCreate = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground text-sm">
          Crea, edita y elimina las cuentas internas de la plataforma.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <UsersToolbar
          search={search}
          activeFilters={activeFilters}
          onSearchChange={(value) => {
            setSearch(value)
            resetPage()
          }}
          onOpenFilters={() => setFiltersOpen(true)}
          actions={
            canWriteUsers ? (
              <Button
                type="button"
                onClick={handleOpenCreate}
                className="shrink-0"
              >
                <PlusIcon />
                Nuevo usuario
              </Button>
            ) : null
          }
        />
        <DataTable
          isLoading={isLoading}
          isError={isError}
          errorMessage="No se pudieron cargar los usuarios."
          isEmpty={pagination.userResponse.length === 0}
          emptyIcon={UsersIcon}
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
            onEdit={handleEdit}
            onToggleStatus={setTogglingStatusUser}
            onResendInvitation={setResendingUser}
            onDelete={setDeletingUser}
          />
        </DataTable>
      </div>

      <UsersFiltersDrawer
        open={filtersOpen}
        filters={filters}
        onOpenChange={setFiltersOpen}
        onApply={(nextFilters) => {
          setFilters(nextFilters)
          resetPage()
        }}
      />

      <UserDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingUser(null)
          }
        }}
        user={editingUser}
      />

      <ResendInvitationDialog
        open={Boolean(resendingUser)}
        user={resendingUser}
        onOpenChange={(open) => {
          if (!open) {
            setResendingUser(null)
          }
        }}
      />

      <ToggleUserStatusDialog
        open={Boolean(togglingStatusUser)}
        user={togglingStatusUser}
        onOpenChange={(open) => {
          if (!open) {
            setTogglingStatusUser(null)
          }
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
