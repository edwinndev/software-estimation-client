import type { UserResponse } from "@/features/auth/types"
import type { PaginatedResponse } from "@/types/api"

export type UserSearchResponse = PaginatedResponse<
  UserResponse,
  "userResponse"
>
