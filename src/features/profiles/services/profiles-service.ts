import type { PaginatedResponse, QueryRequest } from "@/types/api"
import type {
  CreateProfilePayload,
  Profile,
  UpdateProfilePayload,
} from "../types"

const PROFILES_STORAGE_KEY = "software_estimation_profiles"

const defaultProfiles: Profile[] = [
  {
    id: "prof-1",
    name: "Alex Morgan",
    role: "Frontend",
    hourlyRate: 45,
    currency: "USD",
    experienceLevel: "Senior",
    email: "alex.morgan@example.com",
    isActive: true,
    createdAt: new Date("2026-01-10").toISOString(),
    updatedAt: new Date("2026-01-10").toISOString(),
  },
  {
    id: "prof-2",
    name: "Carlos Mendoza",
    role: "Backend",
    hourlyRate: 50,
    currency: "USD",
    experienceLevel: "Senior",
    email: "carlos.mendoza@example.com",
    isActive: true,
    createdAt: new Date("2026-01-15").toISOString(),
    updatedAt: new Date("2026-01-15").toISOString(),
  },
  {
    id: "prof-3",
    name: "Sofia Valdivia",
    role: "QA",
    hourlyRate: 35,
    currency: "USD",
    experienceLevel: "Mid",
    email: "sofia.valdivia@example.com",
    isActive: true,
    createdAt: new Date("2026-02-01").toISOString(),
    updatedAt: new Date("2026-02-01").toISOString(),
  },
  {
    id: "prof-4",
    name: "Daniela Perez",
    role: "Functional Analyst",
    hourlyRate: 40,
    currency: "USD",
    experienceLevel: "Mid",
    email: "daniela.perez@example.com",
    isActive: true,
    createdAt: new Date("2026-02-10").toISOString(),
    updatedAt: new Date("2026-02-10").toISOString(),
  },
]

const getStoredProfiles = (): Profile[] => {
  if (typeof window === "undefined") return defaultProfiles
  const data = localStorage.getItem(PROFILES_STORAGE_KEY)
  if (!data) {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(defaultProfiles))
    return defaultProfiles
  }
  try {
    return JSON.parse(data) as Profile[]
  } catch {
    return defaultProfiles
  }
}

const saveStoredProfiles = (profiles: Profile[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles))
}

export const profilesService = {
  getProfiles: async (
    query?: QueryRequest
  ): Promise<PaginatedResponse<Profile, "profilesResponse">> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let profiles = getStoredProfiles()

    if (query?.filters && query.filters.length > 0) {
      for (const filter of query.filters) {
        if (filter.key === "search" && filter.values[0]) {
          const searchTerm = filter.values[0].toLowerCase()
          profiles = profiles.filter(
            (p) =>
              p.name.toLowerCase().includes(searchTerm) ||
              p.role.toLowerCase().includes(searchTerm) ||
              p.email.toLowerCase().includes(searchTerm)
          )
        }
        if (filter.key === "role" && filter.values[0]) {
          profiles = profiles.filter((p) => p.role === filter.values[0])
        }
      }
    }

    const pageNumber = query?.pagination?.pageNumber ?? 0
    const pageSize = query?.pagination?.pageSize ?? 20
    const totalElements = profiles.length
    const totalPages = Math.ceil(totalElements / pageSize) || 1
    const start = pageNumber * pageSize
    const paginatedItems = profiles.slice(start, start + pageSize)

    return {
      profilesResponse: paginatedItems,
      pageNumber,
      pageSize,
      totalElements,
      totalPages,
      hasNext: pageNumber < totalPages - 1,
      hasPrevious: pageNumber > 0,
    }
  },

  getProfile: async (id: string): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const profiles = getStoredProfiles()
    const profile = profiles.find((p) => p.id === id)
    if (!profile) {
      throw new Error(`Profile with id ${id} not found`)
    }
    return profile
  },

  createProfile: async (payload: CreateProfilePayload): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const profiles = getStoredProfiles()
    const now = new Date().toISOString()
    const newProfile: Profile = {
      ...payload,
      id: `prof-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    profiles.unshift(newProfile)
    saveStoredProfiles(profiles)
    return newProfile
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const profiles = getStoredProfiles()
    const index = profiles.findIndex((p) => p.id === payload.id)
    if (index === -1) {
      throw new Error(`Profile with id ${payload.id} not found`)
    }
    const updated: Profile = {
      ...profiles[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    profiles[index] = updated
    saveStoredProfiles(profiles)
    return updated
  },

  deleteProfile: async (id: string): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const profiles = getStoredProfiles()
    const filtered = profiles.filter((p) => p.id !== id)
    saveStoredProfiles(filtered)
    return { success: true }
  },
}
