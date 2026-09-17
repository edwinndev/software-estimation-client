import type { User } from "@/features/auth/types"
import type { PaginatedResponse } from "@/types/api"

export type UserSearchResponse = PaginatedResponse<User, "userResponse">
