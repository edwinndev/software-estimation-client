"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import type { Profile } from "../types"

type ProfileTableProps = {
  profiles: Profile[]
  onEdit: (profile: Profile) => void
  onDelete: (profile: Profile) => void
}

const getSeniorityBadgeVariant = (level: Profile["experienceLevel"]) => {
  switch (level) {
    case "Senior":
    case "Lead":
      return "default"
    case "Mid":
      return "secondary"
    case "Junior":
    default:
      return "outline"
  }
}

export const ProfileTable = ({
  profiles,
  onEdit,
  onDelete,
}: ProfileTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile / Member</TableHead>
            <TableHead>Technical role</TableHead>
            <TableHead>Seniority</TableHead>
            <TableHead>Hourly CER</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {profile.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{profile.role}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getSeniorityBadgeVariant(profile.experienceLevel)}
                >
                  {profile.experienceLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm font-semibold">
                  {profile.currency} {profile.hourlyRate.toFixed(2)}
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
                    / hr
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={profile.isActive ? "secondary" : "outline"}>
                  {profile.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md text-sm font-medium">
                    <MoreHorizontalIcon className="size-4" />
                    <span className="sr-only">Open actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(profile)}>
                      <PencilIcon className="mr-2 size-4" />
                      Edit profile & CER
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(profile)}
                      variant="destructive"
                    >
                      <Trash2Icon className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
