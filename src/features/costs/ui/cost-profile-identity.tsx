"use client"

import { TECHNICAL_ROLE_OPTIONS } from "@/features/profiles/types"

type CostProfileIdentityProps = {
  name: string
  role: string
  email: string
}

const roleLabelFor = (role: string) => {
  const option = TECHNICAL_ROLE_OPTIONS.find((item) => item.value === role)
  if (!option) {
    return role
  }
  return option.label
}

export const CostProfileIdentity = ({
  name,
  role,
  email,
}: CostProfileIdentityProps) => {
  return (
    <div className="flex min-w-0 flex-col leading-tight">
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground text-xs">
        {roleLabelFor(role)}
      </span>
      <span className="text-muted-foreground text-xs break-all">{email}</span>
    </div>
  )
}
