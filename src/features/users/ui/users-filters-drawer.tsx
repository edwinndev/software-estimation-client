"use client"

import { useForm } from "@tanstack/react-form"
import { CheckIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { AuthField } from "@/features/auth/ui/auth-field"
import { isUserRole } from "@/features/auth/types"
import { getFieldError } from "@/lib/form-errors"
import {
  ALL_ROLES_VALUE,
  userFiltersSchema,
} from "../schemas/user-filters-schema"
import type { UserFilters } from "../types"
import { RoleSelect } from "./role-select"

const emptyFilters: UserFilters = {
  firstName: "",
  email: "",
  role: "",
}

type UsersFiltersDrawerProps = {
  open: boolean
  filters: UserFilters
  onOpenChange: (open: boolean) => void
  onApply: (filters: UserFilters) => void
}

const UsersFiltersForm = ({
  filters,
  onOpenChange,
  onApply,
}: Omit<UsersFiltersDrawerProps, "open">) => {
  const form = useForm({
    defaultValues: {
      firstName: filters.firstName,
      email: filters.email,
      role: filters.role.length > 0 ? filters.role : ALL_ROLES_VALUE,
    },
    validators: {
      onSubmit: userFiltersSchema,
    },
    onSubmit: ({ value }) => {
      onApply({
        firstName: value.firstName.trim(),
        email: value.email.trim(),
        role: isUserRole(value.role) ? value.role : "",
      })
      onOpenChange(false)
    },
  })

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <DrawerHeader>
        <DrawerTitle>Filtros</DrawerTitle>
        <DrawerDescription>
          Selecciona los criterios para filtrar.
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <form.Field name="firstName">
          {(field) => {
            const error = getFieldError(field.state.meta.errors)

            return (
              <AuthField
                label="Nombre"
                htmlFor="users-filter-first-name"
                error={error}
              >
                <Input
                  id="users-filter-first-name"
                  value={field.state.value}
                  placeholder="Ej. Neil"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </AuthField>
            )
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const error = getFieldError(field.state.meta.errors)

            return (
              <AuthField
                label="Correo electrónico"
                htmlFor="users-filter-email"
                error={error}
              >
                <Input
                  id="users-filter-email"
                  type="email"
                  value={field.state.value}
                  placeholder="Ej. neil.armstrong@correo.com"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </AuthField>
            )
          }}
        </form.Field>

        <form.Field name="role">
          {(field) => {
            const error = getFieldError(field.state.meta.errors)

            return (
              <AuthField label="Rol" htmlFor="users-filter-role" error={error}>
                <RoleSelect
                  id="users-filter-role"
                  value={field.state.value}
                  includeAll
                  onValueChange={field.handleChange}
                />
              </AuthField>
            )
          }}
        </form.Field>
      </div>

      <DrawerFooter className="flex-row">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            onApply(emptyFilters)
            onOpenChange(false)
          }}
        >
          <RotateCcwIcon />
          Limpiar filtros
        </Button>
        <Button type="submit" className="flex-1">
          <CheckIcon />
          Aplicar filtros
        </Button>
      </DrawerFooter>
    </form>
  )
}

export const UsersFiltersDrawer = ({
  open,
  filters,
  onOpenChange,
  onApply,
}: UsersFiltersDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:88%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]">
        {open ? (
          <UsersFiltersForm
            key={`${filters.firstName}|${filters.email}|${filters.role}`}
            filters={filters}
            onOpenChange={onOpenChange}
            onApply={onApply}
          />
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
