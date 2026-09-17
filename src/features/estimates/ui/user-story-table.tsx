"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { useAssignStoryPoints, useUserStories } from "../hooks/use-user-stories"
import { STORY_POINTS_OPTIONS } from "../types"
import { userStoriesService } from "../services/user-stories.service"
import type { UserStoryItem } from "../services/user-stories.service"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type UserStoryTableProps = {
  projectId: string
}

export const UserStoryTable = ({ projectId }: UserStoryTableProps) => {
  const { data: stories = [], isLoading } = useUserStories(projectId)
  const assignPoints = useAssignStoryPoints(projectId)
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditEstimation

  const handleAssign = async (story: UserStoryItem, value: string) => {
    const points = Number(value)
    if (!userStoriesService.isStoryPoints(points)) return
    if (story.storyPoints === points) return

    try {
      await assignPoints.mutateAsync({
        storyId: story.id,
        points,
      })
      toast.add({
        title: "Story Points actualizados",
        description: `${story.code} se actualizó.`,
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudieron asignar los puntos",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const totalPoints = stories.reduce(
    (sum, story) => sum + Number(story.storyPoints),
    0
  )
  const assignedCount = stories.filter((story) => story.storyPoints > 0).length

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground text-sm">
        {assignedCount} de {stories.length} historias con puntos. Total:{" "}
        <span className="text-foreground font-medium tabular-nums">
          {totalPoints} SP
        </span>
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Historia de usuario</TableHead>
            <TableHead className="w-40">Story Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-muted-foreground py-6 text-center text-sm"
              >
                No hay historias de usuario en el backlog. Crea historias en
                Historias y tareas para visualizarlas aquí.
              </TableCell>
            </TableRow>
          ) : (
            stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <span className="text-sm font-medium">
                    {story.code} - {story.title}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    disabled={!canWrite}
                    value={
                      story.storyPoints > 0 ? String(story.storyPoints) : ""
                    }
                    onValueChange={(value) => {
                      if (value) {
                        void handleAssign(story, value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORY_POINTS_OPTIONS.map((points) => (
                        <SelectItem key={points} value={String(points)}>
                          {points} SP
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
