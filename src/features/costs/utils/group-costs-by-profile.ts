import type {
  ProfileCostAssignment,
  ProfileCostBreakdown,
} from "../types/profile-cost-breakdown"
import { calculateTaskCost } from "./calculate-task-cost"

type ProfileAccumulator = {
  profileId: string
  profileName: string
  cer: number
  assignments: ProfileCostAssignment[]
}

export const groupCostsByProfile = (
  assignments: readonly ProfileCostAssignment[]
): ProfileCostBreakdown[] => {
  const profiles = new Map<string, ProfileAccumulator>()

  assignments.forEach((assignment) => {
    const profile = profiles.get(assignment.profileId)

    if (profile && profile.cer !== assignment.cer) {
      throw new RangeError("Assignments for the same profile must use one CER")
    }

    if (profile && profile.profileName !== assignment.profileName) {
      throw new Error(
        "Assignments for the same profile must use one profile name"
      )
    }

    if (profile) {
      profile.assignments.push(assignment)
      return
    }

    profiles.set(assignment.profileId, {
      profileId: assignment.profileId,
      profileName: assignment.profileName,
      cer: assignment.cer,
      assignments: [assignment],
    })
  })

  return Array.from(profiles.values(), (profile) => {
    const totalHours = profile.assignments.reduce((total, assignment) => {
      const nextTotal = total + assignment.estimatedHours

      if (!Number.isFinite(nextTotal)) {
        throw new RangeError("Profile total hours overflowed")
      }

      return nextTotal
    }, 0)

    return {
      profileId: profile.profileId,
      profileName: profile.profileName,
      totalHours,
      cer: profile.cer,
      totalCost: calculateTaskCost(profile.assignments),
    }
  })
}
