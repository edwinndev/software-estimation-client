"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BacklogTask, TechnicalProfile } from "../types/stories-types"

export const StoryDetail = ({
  tasks,
  profiles,
  onEdit,
  onDelete,
}: {
  tasks: BacklogTask[]
  profiles: TechnicalProfile[]
  onEdit: (task: BacklogTask) => void
  onDelete: (id: string) => void
}) => (
  <div className="space-y-3">
    {tasks.map((task) => (
      <div
        key={task.id}
        className="bg-muted/40 flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
      >
        <div>
          <p className="font-medium">{task.title}</p>
          <p className="text-muted-foreground text-sm">{task.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">{task.status}</Badge>
            <Badge variant="secondary">{task.estimate} h</Badge>
            {task.profileIds.map((id) => (
              <Badge key={id} variant="outline">
                {profiles.find((profile) => profile.id === id)?.name ?? id}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Editar tarea"
            onClick={() => onEdit(task)}
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Eliminar tarea"
            onClick={() => onDelete(task.id)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    ))}
  </div>
)
