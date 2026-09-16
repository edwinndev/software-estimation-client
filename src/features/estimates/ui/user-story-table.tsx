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

/**
 * Muestra las historias de usuario (dato ajeno, leído de "user-stories")
 * junto con los Story Points asignados (dato propio, leído de
 * "story-points-assignments"). Cruza ambas fuentes por el id de la historia.
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
          <TableHead className="w-28">Story Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stories.map((story) => {
          const points = assignments[story.id]

          return (
            <TableRow key={story.id}>
              <TableCell>
                <span className="font-medium">{story.title}</span>
              </TableCell>
              <TableCell>
                {points !== undefined ? (
                  <StoryPointsBadge points={points} />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Sin asignar
                  </span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
