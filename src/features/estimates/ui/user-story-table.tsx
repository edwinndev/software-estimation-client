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
  useStoryPointsAssignments,
  useUserStories,
} from "../hooks/use-user-stories"
import { StoryPointsBadge } from "./story-points-badge"
import { UserStoryItem } from "../services/user-stories.service"

/**
 * Muestra las historias de usuario (leídas del Backlog)
 * junto con los Story Points asignados (PMGT-36).
 */
export const UserStoryTable = () => {
  const { data: stories = [], isLoading: isLoadingStories } = useUserStories()
  const { data: assignments = {}, isLoading: isLoadingAssignments } =
    useStoryPointsAssignments()

  if (isLoadingStories || isLoadingAssignments) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Historia de usuario</TableHead>
          <TableHead className="w-28 text-center">Story Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stories.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-muted-foreground py-6 text-center text-sm"
            >
              No hay historias de usuario en el backlog. Crea historias en la
              pestaña <strong>Backlog y tareas</strong> para visualizarlas aquí.
            </TableCell>
          </TableRow>
        ) : (
          stories.map((story: UserStoryItem) => {
            const points =
              (assignments as Record<string, number>)[story.id] ??
              story.storyPoints

            return (
              <TableRow key={story.id}>
                <TableCell>
                  <span className="text-xs font-medium">
                    {story.code ? `${story.code} - ` : ""}
                    {story.title}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {points !== undefined && points !== null ? (
                    <StoryPointsBadge points={points} />
                  ) : (
                    <span className="text-muted-foreground text-xs italic">
                      Sin asignar
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
