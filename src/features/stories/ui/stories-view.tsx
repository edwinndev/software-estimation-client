"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StoryFormModal } from "./story-form-modal"
import { StoryList } from "./story-list"
import { TaskForm } from "./task-form"
import { useStories } from "../hooks/use-stories"
import type { BacklogTask, UserStory } from "../types/stories-types"
import type { StoryFormValues, TaskFormValues } from "../schemas/stories-schema"

export const StoriesView = ({ projectId }: { projectId: string }) => {
  const api = useStories(projectId)
  const [story, setStory] = useState<UserStory | "new" | null>(null)
  const [task, setTask] = useState<{
    storyId: string
    task?: BacklogTask
  } | null>(null)
  const stories = api.data?.stories ?? []
  const tasks = api.data?.tasks ?? []
  const saveStory = (values: StoryFormValues) => {
    if (story === "new") api.createStory.mutate(values)
    else if (story) api.updateStory.mutate({ id: story.id, values })
    setStory(null)
  }
  const saveTask = (values: TaskFormValues) => {
    if (task?.task) api.updateTask.mutate({ id: task.task.id, values })
    else if (task) api.createTask.mutate({ storyId: task.storyId, values })
    setTask(null)
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-primary text-sm font-semibold">
            Proyecto #{projectId}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Historias y tareas
          </h1>
          <p className="text-muted-foreground mt-1">
            Define el alcance funcional y asígnalo al equipo técnico.
          </p>
        </div>
        <Button onClick={() => setStory("new")}>
          <PlusIcon />
          Nueva historia
        </Button>
      </div>
      {api.isLoading ? (
        <p className="text-muted-foreground">Cargando historias...</p>
      ) : stories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">Aún no hay historias de usuario</p>
          </CardContent>
        </Card>
      ) : (
        <StoryList
          stories={stories}
          tasks={tasks}
          profiles={api.profiles}
          onEdit={setStory}
          onDelete={(id) =>
            window.confirm("¿Eliminar esta historia y sus tareas?") &&
            api.deleteStory.mutate(id)
          }
          onAddTask={(storyId) => setTask({ storyId })}
          onEditTask={(storyId, selectedTask) =>
            setTask({ storyId, task: selectedTask })
          }
          onDeleteTask={(id) =>
            window.confirm("¿Eliminar esta tarea?") && api.deleteTask.mutate(id)
          }
        />
      )}
      <StoryFormModal
        open={story !== null}
        initial={
          story && story !== "new"
            ? {
                title: story.title,
                description: story.description,
                priority: story.priority,
                status: story.status,
              }
            : undefined
        }
        onOpenChange={(open) => !open && setStory(null)}
        onSubmit={saveStory}
      />
      <Dialog
        open={task !== null}
        onOpenChange={(open) => !open && setTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {task?.task ? "Editar tarea" : "Nueva tarea"}
            </DialogTitle>
            <DialogDescription>
              Desglosa el trabajo y asigna perfiles técnicos.
            </DialogDescription>
          </DialogHeader>
          {task && (
            <TaskForm
              profiles={api.profiles}
              initial={
                task.task
                  ? {
                      title: task.task.title,
                      description: task.task.description,
                      estimate: task.task.estimate,
                      status: task.task.status,
                      profileIds: task.task.profileIds,
                    }
                  : undefined
              }
              onSubmit={saveTask}
              onCancel={() => setTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
