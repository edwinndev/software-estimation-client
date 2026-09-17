import type {
  CostTechnicalProfile,
  ExternalHourAssignment,
  NormalizedCostAssignment,
} from "../types/cost-adapter"

const createProfileCatalog = (
  profiles: readonly CostTechnicalProfile[]
): ReadonlyMap<string, CostTechnicalProfile> => {
  const catalog = new Map<string, CostTechnicalProfile>()

  profiles.forEach((profile) => {
    if (!Number.isFinite(profile.cer) || profile.cer < 0) {
      throw new RangeError("Profile CER must be finite and non-negative")
    }

    if (catalog.has(profile.profileId)) {
      throw new Error("Technical profile identifiers must be unique")
    }

    catalog.set(profile.profileId, profile)
  })

  return catalog
}

export const adaptCostData = (
  projectId: string,
  assignments: readonly ExternalHourAssignment[],
  profiles: readonly CostTechnicalProfile[]
): NormalizedCostAssignment[] => {
  const profileCatalog = createProfileCatalog(profiles)
  const taskNames = new Map<string, string>()

  return assignments
    .filter((assignment) => assignment.projectId === projectId)
    .map((assignment) => {
      if (!Number.isFinite(assignment.hours) || assignment.hours < 0) {
        throw new RangeError("Estimated hours must be finite and non-negative")
      }

      const taskName = taskNames.get(assignment.taskId)

      if (taskName !== undefined && taskName !== assignment.taskName) {
        throw new Error("Assignments for the same task must use one task name")
      }

      if (taskName === undefined) {
        taskNames.set(assignment.taskId, assignment.taskName)
      }

      const profile = profileCatalog.get(assignment.profileId)

      if (!profile) {
        throw new Error("Technical profile not found")
      }

      if (assignment.profileName !== profile.profileName) {
        throw new Error("Assignment and technical profile names must match")
      }

      return {
        taskId: assignment.taskId,
        taskName: assignment.taskName,
        profileId: profile.profileId,
        profileName: profile.profileName,
        estimatedHours: assignment.hours,
        cer: profile.cer,
      }
    })
}
