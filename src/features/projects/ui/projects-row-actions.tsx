"use client"

import Link from "next/link"
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Project } from "../types/project-types"
import { useProjectAccess } from "../hooks/use-project-access"

type ProjectsRowActionsProps = {
  project: Project
  onDelete: (project: Project) => void
}

export const ProjectsRowActions = ({
  project,
  onDelete,
}: ProjectsRowActionsProps) => {
  const access = useProjectAccess(project.id)
  const deleteLabel = access.canDeleteProject
    ? "Eliminar"
    : "No se puede eliminar en este estado"

  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/projects/${project.id}`}
              className={buttonVariants({
                variant: "ghost",
                size: "icon-sm",
              })}
            />
          }
        >
          <PencilIcon />
          <span className="sr-only">Gestionar proyecto</span>
        </TooltipTrigger>
        <TooltipContent>Gestionar proyecto</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          aria-label="Más acciones"
        >
          <MoreHorizontalIcon />
          <span className="sr-only">Más acciones</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem
            variant="destructive"
            disabled={!access.canDeleteProject}
            onClick={(e) => {
              e.stopPropagation()
              if (!access.canDeleteProject) {
                return
              }
              onDelete(project)
            }}
          >
            <TrashIcon />
            {deleteLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
