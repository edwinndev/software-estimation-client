"use client"

import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StoryDetail } from "./story-detail"
import type {
  BacklogTask,
  TechnicalProfile,
  UserStory,
} from "../types/stories-types"

interface StoryListProps {
  stories: UserStory[]
  tasks: BacklogTask[]
  profiles: TechnicalProfile[]
  onEdit: (story: UserStory) => void
  onDelete: (id: string) => void
  onAddTask: (id: string) => void
  onEditTask: (storyId: string, task: BacklogTask) => void
  onDeleteTask: (id: string) => void
}
export const StoryList = ({
  stories,
  tasks,
  profiles,
  onEdit,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: StoryListProps) => (
  <div className="grid gap-4">
    {stories.map((story) => (
      <Card key={story.id}>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">{story.title}</CardTitle>
            <CardDescription>{story.description}</CardDescription>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Editar historia"
              onClick={() => onEdit(story)}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Eliminar historia"
              onClick={() => onDelete(story.id)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{story.status}</Badge>
            <Badge variant="secondary">Prioridad {story.priority}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddTask(story.id)}
            >
              <PlusIcon />
              Agregar tarea
            </Button>
          </div>
          <StoryDetail
            tasks={tasks.filter((task) => task.storyId === story.id)}
            profiles={profiles}
            onEdit={(task) => onEditTask(story.id, task)}
            onDelete={onDeleteTask}
          />
        </CardContent>
      </Card>
    ))}
  </div>
)
