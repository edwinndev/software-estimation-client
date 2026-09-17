import type { PaginatedResponse, QueryRequest } from "@/types/api"
import { CURRENCY_CODE } from "@/lib/format"
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import type {
  CreateProfilePayload,
  Profile,
  UpdateProfilePayload,
  UpdateProfileStatus,
} from "../types"

const PROFILES_STORAGE_KEY = STORAGE_KEYS.PROFILES
const SIMULATED_DELAY_MS = 250

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const toHourlyRate = (value: unknown): number => {
  const rate = typeof value === "number" ? value : Number(value)
  return Number.isFinite(rate) && rate > 0 ? rate : 0
}

const getStoredProfiles = (): Profile[] => {
  const data = readJson<Profile[]>(PROFILES_STORAGE_KEY)
  if (!Array.isArray(data)) {
    return []
  }
  return data.map((profile) => ({
    ...profile,
    email: typeof profile.email === "string" ? profile.email : "",
    hourlyRate: toHourlyRate(profile.hourlyRate),
    currency: CURRENCY_CODE,
    isActive: profile.isActive === false ? false : true,
  }))
}

const saveStoredProfiles = (profiles: Profile[]): void => {
  writeJson(PROFILES_STORAGE_KEY, profiles)
}

export const profilesService = {
  getProfiles: async (
    query?: QueryRequest
  ): Promise<PaginatedResponse<Profile, "profilesResponse">> => {
    await delay(SIMULATED_DELAY_MS)
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
    await delay(SIMULATED_DELAY_MS)
    const profiles = getStoredProfiles()
    const profile = profiles.find((p) => p.id === id)
    if (!profile) {
      throw new Error(`Perfil con ID "${id}" no encontrado.`)
    }
    return profile
  },

  createProfile: async (payload: CreateProfilePayload): Promise<Profile> => {
    await delay(SIMULATED_DELAY_MS)
    const profiles = getStoredProfiles()
    const now = new Date().toISOString()
    const newProfile: Profile = {
      ...payload,
      currency: CURRENCY_CODE,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    profiles.unshift(newProfile)
    saveStoredProfiles(profiles)
    return newProfile
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<Profile> => {
    await delay(SIMULATED_DELAY_MS)
    const profiles = getStoredProfiles()
    const index = profiles.findIndex((p) => p.id === payload.id)
    if (index === -1) {
      throw new Error(`Perfil con ID "${payload.id}" no encontrado.`)
    }
    const updated: Profile = {
      ...profiles[index],
      ...payload,
      currency: CURRENCY_CODE,
      updatedAt: new Date().toISOString(),
    }
    profiles[index] = updated
    saveStoredProfiles(profiles)
    return updated
  },

  deleteProfile: async (id: string): Promise<{ success: boolean }> => {
    await delay(SIMULATED_DELAY_MS)
    const profiles = getStoredProfiles()
    const filtered = profiles.filter((p) => p.id !== id)
    saveStoredProfiles(filtered)
    return { success: true }
  },

  updateProfileStatus: async (input: UpdateProfileStatus): Promise<Profile> => {
    return profilesService.updateProfile({
      id: input.id,
      isActive: input.isActive,
    })
  },
}
