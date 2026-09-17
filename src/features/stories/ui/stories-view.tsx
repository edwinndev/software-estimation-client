"use client"

import { useState } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Clock3Icon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserRound,
} from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { StoryForm } from "./story-form-modal"
import { StoryDetail } from "./story-detail"
import { StoryList } from "./story-list"
import { TaskForm } from "./task-form"
import { TaskProfileInfo } from "./task-profile-info"
import { BacklogDeleteDialog } from "./backlog-delete-dialog"
import { IconTooltipButton } from "./icon-tooltip-button"
import { useStories } from "../hooks/use-stories"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"
import type {
  BacklogTask,
  MoveDirection,
  UserStory,
} from "../types/story-types"
import type { StoryFormValues, TaskFormValues } from "../schemas/story-schema"
import {
  findOption,
  PROFILE_OPTIONS,
  STORY_PRIORITY_OPTIONS,
  STORY_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "./story-options"

export const StoriesView = ({ projectId }: { projectId: string }) => {
  const backlog = useStories(projectId)
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditBacklog
  const [storyDialog, setStoryDialog] = useState<UserStory | "new" | null>(null)
  const [taskDialog, setTaskDialog] = useState<{
    storyId: string
    task: BacklogTask | null
  } | null>(null)
  const [storyToDelete, setStoryToDelete] = useState<UserStory | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<BacklogTask | null>(null)
  const stories = backlog.data?.stories ?? []
  const tasks = backlog.data?.tasks ?? []

  const saveStory = async (values: StoryFormValues) => {
    try {
      if (storyDialog === "new") {
        await backlog.createStory.mutateAsync(values)
        toast.add({
          title: "Historia creada",
          description: `${values.title} se registró correctamente.`,
          type: "success",
        })
      } else if (storyDialog) {
        await backlog.updateStory.mutateAsync({
          id: storyDialog.id,
          values,
        })
        toast.add({
          title: "Historia actualizada",
          description: `Los datos de ${values.title} se guardaron correctamente.`,
          type: "success",
        })
      }
      setStoryDialog(null)
    } catch (error) {
      toast.add({
        title: "No se pudo guardar la historia",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const saveTask = async (values: TaskFormValues) => {
    try {
      if (!taskDialog) {
        return
      }
      if (taskDialog.task) {
        await backlog.updateTask.mutateAsync({
          id: taskDialog.task.id,
          values,
        })
        toast.add({
          title: "Tarea actualizada",
          description: `Los datos de ${values.title} se guardaron correctamente.`,
          type: "success",
        })
      } else {
        await backlog.createTask.mutateAsync({
          storyId: taskDialog.storyId,
          values,
        })
        toast.add({
          title: "Tarea creada",
          description: `${values.title} se registró correctamente.`,
          type: "success",
        })
      }
      setTaskDialog(null)
    } catch (error) {
      toast.add({
        title: "No se pudo guardar la tarea",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return
    try {
      await backlog.deleteStory.mutateAsync(storyToDelete.id)
      toast.add({
        title: "Historia eliminada",
        description: `${storyToDelete.title} se eliminó correctamente.`,
        type: "success",
      })
      setStoryToDelete(null)
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar la historia",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return
    try {
      await backlog.deleteTask.mutateAsync(taskToDelete.id)
      toast.add({
        title: "Tarea eliminada",
        description: `${taskToDelete.title} se eliminó correctamente.`,
        type: "success",
      })
      setTaskToDelete(null)
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar la tarea",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const reorderStory = async (id: string, direction: MoveDirection) => {
    try {
      await backlog.moveStory.mutateAsync({ id, direction })
      toast.add({
        title: "Historia reordenada",
        description: "El orden de las historias se actualizó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo reordenar la historia",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const reorderTask = async (id: string, direction: MoveDirection) => {
    try {
      await backlog.moveTask.mutateAsync({ id, direction })
      toast.add({
        title: "Tarea reordenada",
        description: "El orden de las tareas se actualizó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo reordenar la tarea",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Historias y tareas
          </h1>
          <p className="text-muted-foreground text-sm">
            Define el alcance funcional y asígnalo al equipo técnico.
          </p>
        </div>
        <Button
          disabled={!canWrite}
          onClick={() => {
            if (!canWrite) {
              return
            }
            setStoryDialog("new")
          }}
        >
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
        <StoryList>
          {stories.map((story, index) => {
            const status = findOption(STORY_STATUS_OPTIONS, story.status)
            const priority = findOption(STORY_PRIORITY_OPTIONS, story.priority)
            const StatusIcon = status?.icon
            const PriorityIcon = priority?.icon
            const storyTasks = tasks.filter((task) => task.storyId === story.id)
            const canMoveStoryUp = index > 0
            const canMoveStoryDown = index < stories.length - 1

            return (
              <StoryDetail key={story.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide">
                      {story.code}
                    </p>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <CardDescription>{story.description}</CardDescription>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-1">
                    <IconTooltipButton
                      label={
                        !canWrite
                          ? "No se puede modificar el backlog en este estado"
                          : canMoveStoryUp
                            ? "Subir historia"
                            : "La historia ya está al inicio"
                      }
                      disabled={!canWrite || !canMoveStoryUp}
                      onClick={() => reorderStory(story.id, "up")}
                    >
                      <ChevronUpIcon />
                    </IconTooltipButton>
                    <IconTooltipButton
                      label={
                        !canWrite
                          ? "No se puede modificar el backlog en este estado"
                          : canMoveStoryDown
                            ? "Bajar historia"
                            : "La historia ya está al final"
                      }
                      disabled={!canWrite || !canMoveStoryDown}
                      onClick={() => reorderStory(story.id, "down")}
                    >
                      <ChevronDownIcon />
                    </IconTooltipButton>
                    <IconTooltipButton
                      label={
                        canWrite
                          ? "Editar historia"
                          : "No se puede modificar el backlog en este estado"
                      }
                      disabled={!canWrite}
                      onClick={() => setStoryDialog(story)}
                    >
                      <PencilIcon />
                    </IconTooltipButton>
                    <IconTooltipButton
                      label={
                        canWrite
                          ? "Eliminar historia"
                          : "No se puede modificar el backlog en este estado"
                      }
                      disabled={!canWrite}
                      onClick={() => setStoryToDelete(story)}
                    >
                      <TrashIcon />
                    </IconTooltipButton>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {status && StatusIcon ? (
                      <Badge variant={status.variant}>
                        <StatusIcon />
                        {status.label}
                      </Badge>
                    ) : null}
                    {priority && PriorityIcon ? (
                      <Badge variant={priority.variant}>
                        <PriorityIcon />
                        {priority.label}
                      </Badge>
                    ) : null}
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!canWrite}
                            onClick={() => {
                              if (!canWrite) {
                                return
                              }
                              setTaskDialog({ storyId: story.id, task: null })
                            }}
                          />
                        }
                      >
                        <PlusIcon />
                        Agregar tarea
                      </TooltipTrigger>
                      <TooltipContent>
                        {canWrite
                          ? "Agregar una tarea a esta historia"
                          : "No se puede modificar el backlog en este estado"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {storyTasks.map((task, taskIndex) => {
                    const taskStatus = findOption(
                      TASK_STATUS_OPTIONS,
                      task.status
                    )
                    const TaskStatusIcon = taskStatus?.icon
                    const canMoveTaskUp = taskIndex > 0
                    const canMoveTaskDown = taskIndex < storyTasks.length - 1

                    return (
                      <div
                        key={task.id}
                        className="bg-muted/40 flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {task.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {taskStatus && TaskStatusIcon ? (
                              <Badge variant={taskStatus.variant}>
                                <TaskStatusIcon />
                                {taskStatus.label}
                              </Badge>
                            ) : null}
                            <Badge variant="secondary">
                              <Clock3Icon />
                              {task.estimate} h
                            </Badge>
                            {task.profileIds.map((id) => {
                              const assigned = backlog.profiles.find(
                                (item) => item.id === id
                              )
                              const roleOption = findOption(
                                PROFILE_OPTIONS,
                                assigned ? assigned.role : id
                              )
                              const roleLabel = roleOption
                                ? roleOption.label
                                : assigned
                                  ? assigned.role
                                  : id

                              return (
                                <div
                                  key={id}
                                  className="bg-background max-w-64 rounded-md border px-2 py-1.5"
                                >
                                  <TaskProfileInfo
                                    name={assigned ? assigned.name : roleLabel}
                                    roleLabel={roleLabel}
                                    email={assigned ? assigned.email : ""}
                                    hourlyRate={
                                      assigned ? assigned.hourlyRate : 0
                                    }
                                    icon={
                                      roleOption ? roleOption.icon : UserRound
                                    }
                                    color={
                                      roleOption
                                        ? roleOption.color
                                        : "text-muted-foreground"
                                    }
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <IconTooltipButton
                            label={
                              !canWrite
                                ? "No se puede modificar el backlog en este estado"
                                : canMoveTaskUp
                                  ? "Subir tarea"
                                  : "La tarea ya está al inicio"
                            }
                            disabled={!canWrite || !canMoveTaskUp}
                            onClick={() => reorderTask(task.id, "up")}
                          >
                            <ChevronUpIcon />
                          </IconTooltipButton>
                          <IconTooltipButton
                            label={
                              !canWrite
                                ? "No se puede modificar el backlog en este estado"
                                : canMoveTaskDown
                                  ? "Bajar tarea"
                                  : "La tarea ya está al final"
                            }
                            disabled={!canWrite || !canMoveTaskDown}
                            onClick={() => reorderTask(task.id, "down")}
                          >
                            <ChevronDownIcon />
                          </IconTooltipButton>
                          <IconTooltipButton
                            label={
                              canWrite
                                ? "Editar tarea"
                                : "No se puede modificar el backlog en este estado"
                            }
                            disabled={!canWrite}
                            onClick={() =>
                              setTaskDialog({ storyId: story.id, task })
                            }
                          >
                            <PencilIcon />
                          </IconTooltipButton>
                          <IconTooltipButton
                            label={
                              canWrite
                                ? "Eliminar tarea"
                                : "No se puede modificar el backlog en este estado"
                            }
                            disabled={!canWrite}
                            onClick={() => setTaskToDelete(task)}
                          >
                            <TrashIcon />
                          </IconTooltipButton>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </StoryDetail>
            )
          })}
        </StoryList>
      )}
      {storyDialog !== null ? (
        <Dialog
          open={storyDialog !== null}
          onOpenChange={(dialogOpen) => {
            if (!dialogOpen) {
              setStoryDialog(null)
            }
          }}
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
                  : null
              }
              onSubmit={saveStory}
              onCancel={() => setStoryDialog(null)}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      {taskDialog !== null ? (
        <Dialog
          open={taskDialog !== null}
          onOpenChange={(dialogOpen) => {
            if (!dialogOpen) {
              setTaskDialog(null)
            }
          }}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {taskDialog && taskDialog.task ? "Editar tarea" : "Nueva tarea"}
              </DialogTitle>
              <DialogDescription>
                Desglosa el trabajo y asigna uno o más perfiles técnicos.
              </DialogDescription>
            </DialogHeader>
            {taskDialog ? (
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
                    : null
                }
                onSubmit={saveTask}
                onCancel={() => setTaskDialog(null)}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      ) : null}
      <BacklogDeleteDialog
        open={storyToDelete !== null}
        title="Eliminar historia"
        itemName={
          storyToDelete ? `${storyToDelete.code} · ${storyToDelete.title}` : ""
        }
        confirmLabel="Eliminar historia"
        isPending={backlog.deleteStory.isPending}
        onClose={() => setStoryToDelete(null)}
        onConfirm={confirmDeleteStory}
      />
      <BacklogDeleteDialog
        open={taskToDelete !== null}
        title="Eliminar tarea"
        itemName={taskToDelete ? taskToDelete.title : ""}
        confirmLabel="Eliminar tarea"
        isPending={backlog.deleteTask.isPending}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
      />
    </div>
  )
}
