export type TechnicalRole =
  | "Frontend"
  | "Backend"
  | "Fullstack"
  | "QA"
  | "DevOps"
  | "UI/UX Designer"
  | "Product Manager"
  | "Tech Lead"
  | "Functional Analyst"
  | "Other"

export type Profile = {
  id: string
  name: string
  role: TechnicalRole
  hourlyRate: number // Costo Estándar por Recurso (CER) por hora
  currency: string
  experienceLevel: "Junior" | "Mid" | "Senior" | "Lead"
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateProfilePayload = {
  name: string
  role: TechnicalRole
  hourlyRate: number
  currency: string
  experienceLevel: "Junior" | "Mid" | "Senior" | "Lead"
  email: string
  isActive: boolean
}

export type UpdateProfilePayload = Partial<CreateProfilePayload> & {
  id: string
}
