"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import {
  experienceLevels,
  profileSchema,
  technicalRoles,
  type ProfileFormValues,
} from "../schemas/profile-schema"
import { useCreateProfile, useUpdateProfile } from "../hooks/use-profiles"
import type { Profile } from "../types"

type ProfileFormProps = {
  profile?: Profile | null
  onSuccess?: () => void
  onCancel?: () => void
}

export const ProfileForm = ({
  profile,
  onSuccess,
  onCancel,
}: ProfileFormProps) => {
  const isEditing = Boolean(profile)
  const createProfileMutation = useCreateProfile()
  const updateProfileMutation = useUpdateProfile()

  const defaultValues: ProfileFormValues = {
    name: profile?.name ?? "",
    role: profile?.role ?? "Frontend",
    hourlyRate: profile?.hourlyRate ?? 40,
    currency: profile?.currency ?? "USD",
    experienceLevel: profile?.experienceLevel ?? "Mid",
    email: profile?.email ?? "",
    isActive: profile?.isActive ?? true,
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing && profile) {
          await updateProfileMutation.mutateAsync({
            id: profile.id,
            ...value,
          })
          toast.add({
            title: "Profile updated",
            description: `Profile "${value.name}" has been updated successfully.`,
            type: "success",
          })
        } else {
          await createProfileMutation.mutateAsync(value)
          toast.add({
            title: "Profile created",
            description: `Technical profile "${value.name}" has been registered.`,
            type: "success",
          })
        }
        onSuccess?.()
      } catch (error) {
        toast.add({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to save profile. Please try again.",
          type: "error",
        })
      }
    },
  })

  const isSubmitting =
    createProfileMutation.isPending || updateProfileMutation.isPending

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Full name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Jane Doe"
              disabled={isSubmitting}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-xs">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="role">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Technical role</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val) field.handleChange(val as ProfileFormValues["role"])
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {technicalRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="experienceLevel">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Seniority level</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val)
                    field.handleChange(
                      val as ProfileFormValues["experienceLevel"]
                    )
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="hourlyRate">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Standard cost / hour (CER)</Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type="number"
                  step="0.5"
                  min="1"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.valueAsNumber || 0)
                  }
                  placeholder="e.g. 45"
                  disabled={isSubmitting}
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="currency">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Currency</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val) field.handleChange(val)
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="PEN">PEN (S/.)</SelectItem>
                  <SelectItem value="COP">COP ($)</SelectItem>
                  <SelectItem value="MXN">MXN ($)</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="email">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Contact email</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. jane@company.com"
              disabled={isSubmitting}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-xs">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex justify-end gap-2 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update profile"
              : "Register profile"}
        </Button>
      </div>
    </form>
  )
}
