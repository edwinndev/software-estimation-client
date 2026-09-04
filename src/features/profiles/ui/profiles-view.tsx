"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import type { FilterRequest, QueryRequest } from "@/types/api"
import { useProfiles } from "../hooks/use-profiles"
import type { Profile } from "../types"
import { ProfileStats } from "./profile-stats"
import { ProfileFilters } from "./profile-filters"
import { ProfileTable } from "./profile-table"
import { ProfileDialog } from "./profile-dialog"
import { DeleteProfileDialog } from "./delete-profile-dialog"

export const ProfilesView = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("ALL")
  const [pageNumber, setPageNumber] = useState(0)
  const pageSize = 10

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)

  const filters: FilterRequest[] = []
  if (searchQuery.trim()) {
    filters.push({
      key: "search",
      operator: "LK",
      values: [searchQuery.trim()],
    })
  }
  if (selectedRole && selectedRole !== "ALL") {
    filters.push({
      key: "role",
      operator: "EQ",
      values: [selectedRole],
    })
  }

  const queryRequest: QueryRequest = {
    filters,
    pagination: {
      pageNumber,
      pageSize,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  }

  const { data, isLoading, isError, error } = useProfiles(queryRequest)

  const profiles = data?.profilesResponse ?? []
  const paginationMeta = {
    pageNumber: data?.pageNumber ?? 0,
    pageSize: data?.pageSize ?? pageSize,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 1,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
  }

  const handleOpenCreate = () => {
    setEditingProfile(null)
    setDialogOpen(true)
  }

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile)
    setDialogOpen(true)
  }

  const handleDelete = (profile: Profile) => {
    setDeletingProfile(profile)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Technical profiles & CER management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage technical roles, seniority levels, and standard resource costs
          per hour (CER).
        </p>
      </div>

      <ProfileStats profiles={profiles} />

      <div className="flex flex-col gap-4">
        <ProfileFilters
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val)
            setPageNumber(0)
          }}
          selectedRole={selectedRole}
          onRoleChange={(val) => {
            setSelectedRole(val)
            setPageNumber(0)
          }}
          onOpenCreateDialog={handleOpenCreate}
        />

        <DataTable
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message ?? "Error loading technical profiles."}
          isEmpty={profiles.length === 0}
          emptyMessage="No technical profiles found. Register the first technical profile."
          pagination={paginationMeta}
          onPageChange={setPageNumber}
        >
          <ProfileTable
            profiles={profiles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </DataTable>
      </div>

      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={editingProfile}
      />

      <DeleteProfileDialog
        open={Boolean(deletingProfile)}
        onOpenChange={(open) => !open && setDeletingProfile(null)}
        profile={deletingProfile}
      />
    </div>
  )
}
