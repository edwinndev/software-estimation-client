"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StoryForm, TaskForm } from "./backlog-form"
import { useBacklog } from "../hooks/use-backlog"
import type { BacklogTask, UserStory } from "../types/backlog-types"
import type { StoryFormValues, TaskFormValues } from "../schemas/backlog-schema"

const storyStatus: Record<UserStory["status"], string> = {
  draft: "Borrador",
  ready: "Lista",
  "in-progress": "En progreso",
  done: "Completada",
}
const taskStatus: Record<BacklogTask["status"], string> = {
  todo: "Pendiente",
  "in-progress": "En progreso",
  done: "Completada",
}

export const BacklogView = ({ projectId }: { projectId: string }) => {
  const backlog = useBacklog(projectId)
  const [storyDialog, setStoryDialog] = useState<UserStory | "new" | null>(null)
  const [taskDialog, setTaskDialog] = useState<{
    storyId: string
    task?: BacklogTask
  } | null>(null)
  const stories = backlog.data?.stories ?? []
  const tasks = backlog.data?.tasks ?? []
  const saveStory = (values: StoryFormValues) => {
    if (storyDialog === "new") backlog.createStory.mutate(values)
    else if (storyDialog)
      backlog.updateStory.mutate({ id: storyDialog.id, values })
    setStoryDialog(null)
  }
  const saveTask = (values: TaskFormValues) => {
    if (taskDialog?.task)
      backlog.updateTask.mutate({ id: taskDialog.task.id, values })
    else if (taskDialog)
      backlog.createTask.mutate({ storyId: taskDialog.storyId, values })
    setTaskDialog(null)
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
        <Button onClick={() => setStoryDialog("new")}>
          <PlusIcon />
          Nueva historia
        </Button>
      </div>
      {backlog.isLoading ? (
        <p className="text-muted-foreground">Cargando backlog...</p>
      ) : stories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">Aún no hay historias de usuario</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Registra la primera historia para comenzar a desglosar el
              proyecto.
            </p>
          </CardContent>
        </Card>
      ) : (
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
                    onClick={() => setStoryDialog(story)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Eliminar historia"
                    onClick={() =>
                      window.confirm("¿Eliminar esta historia y sus tareas?") &&
                      backlog.deleteStory.mutate(story.id)
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{storyStatus[story.status]}</Badge>
                  <Badge variant="secondary">
                    Prioridad{" "}
                    {story.priority === "high"
                      ? "alta"
                      : story.priority === "low"
                        ? "baja"
                        : "media"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTaskDialog({ storyId: story.id })}
                  >
                    <PlusIcon />
                    Agregar tarea
                  </Button>
                </div>
                {tasks
                  .filter((task) => task.storyId === story.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-muted/40 flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {task.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {taskStatus[task.status]}
                          </Badge>
                          <Badge variant="secondary">{task.estimate} h</Badge>
                          {task.profileIds.map((id) => (
                            <Badge key={id} variant="outline">
                              {backlog.profiles.find(
                                (profile) => profile.id === id
                              )?.name ?? id}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar tarea"
                          onClick={() =>
                            setTaskDialog({ storyId: story.id, task })
                          }
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Eliminar tarea"
                          onClick={() =>
                            window.confirm("¿Eliminar esta tarea?") &&
                            backlog.deleteTask.mutate(task.id)
                          }
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={storyDialog !== null}
        onOpenChange={(open) => !open && setStoryDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {storyDialog === "new"
                ? "Nueva historia de usuario"
                : "Editar historia"}
            </DialogTitle>
            <DialogDescription>
              Registra la necesidad y su prioridad dentro del alcance.
            </DialogDescription>
          </DialogHeader>
          <StoryForm
            initial={
              storyDialog && storyDialog !== "new"
                ? {
                    title: storyDialog.title,
                    description: storyDialog.description,
                    priority: storyDialog.priority,
                    status: storyDialog.status,
                  }
                : undefined
            }
            onSubmit={saveStory}
            onCancel={() => setStoryDialog(null)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={taskDialog !== null}
        onOpenChange={(open) => !open && setTaskDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {taskDialog?.task ? "Editar tarea" : "Nueva tarea"}
            </DialogTitle>
            <DialogDescription>
              Desglosa el trabajo y asigna uno o más perfiles técnicos.
            </DialogDescription>
          </DialogHeader>
          {taskDialog && (
            <TaskForm
              profiles={backlog.profiles}
              initial={
                taskDialog.task
                  ? {
                      title: taskDialog.task.title,
                      description: taskDialog.task.description,
                      estimate: taskDialog.task.estimate,
                      status: taskDialog.task.status,
                      profileIds: taskDialog.task.profileIds,
                    }
                  : undefined
              }
              onSubmit={saveTask}
              onCancel={() => setTaskDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
