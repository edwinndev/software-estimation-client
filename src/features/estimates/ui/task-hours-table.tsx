"use client"

import { useState } from "react"
import { CheckIcon, PencilIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { useTaskHours, useUpdateTaskHours } from "../hooks/use-task-hours"
import type { TaskHourEntry } from "../types"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type TaskHoursTableProps = {
  projectId: string
}

type StoryGroup = {
  storyId: string
  storyCode: string
  storyTitle: string
  entries: TaskHourEntry[]
}

const groupByStory = (entries: TaskHourEntry[]): StoryGroup[] => {
  const groups: StoryGroup[] = []

  entries.forEach((entry) => {
    const current = groups.find((group) => group.storyId === entry.storyId)
    if (current) {
      current.entries.push(entry)
      return
    }

    groups.push({
      storyId: entry.storyId,
      storyCode: entry.storyCode,
      storyTitle: entry.storyTitle,
      entries: [entry],
    })
  })

  return groups
}

export const TaskHoursTable = ({ projectId }: TaskHoursTableProps) => {
  const { data: entries = [], isLoading } = useTaskHours(projectId)
  const updateHours = useUpdateTaskHours(projectId)
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditEstimation
  const [editingId, setEditingId] = useState("")
  const [editHours, setEditHours] = useState(0)
  const [editReason, setEditReason] = useState("")

  const groups = groupByStory(entries)
  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.estimatedHours,
    0
  )

  const handleStartEdit = (entry: TaskHourEntry) => {
    setEditingId(entry.id)
    setEditHours(entry.estimatedHours)
    setEditReason(entry.adjustmentReason)
  }

  const handleSave = async (entry: TaskHourEntry) => {
    try {
      await updateHours.mutateAsync({
        taskId: entry.taskId,
        profileId: entry.profileId,
        hours: editHours,
        adjustmentReason: editReason.trim(),
      })
      toast.add({
        title: "Horas actualizadas",
        description: `${entry.taskTitle} se actualizó.`,
        type: "success",
      })
      setEditingId("")
      setEditReason("")
    } catch (error) {
      toast.add({
        title: "No se pudieron guardar las horas",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        No hay tareas en el backlog. Crea historias y tareas para calcular las
        horas automáticamente según la estimación y los perfiles asignados.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => {
        const storyTotal = group.entries.reduce(
          (sum, entry) => sum + entry.estimatedHours,
          0
        )

        return (
          <div key={group.storyId} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {group.storyCode} - {group.storyTitle}
              </p>
              <p className="text-muted-foreground text-sm tabular-nums">
                {storyTotal.toFixed(1)} h
              </p>
            </div>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead className="w-28 text-right">Horas</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead className="w-24 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.entries.map((entry) => {
                    const isEditing = editingId === entry.id

                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {entry.taskTitle}
                        </TableCell>
                        <TableCell>{entry.profileName}</TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <NumberInput
                              id={`hours-${entry.id}`}
                              value={editHours}
                              min={0}
                              max={9999}
                              step={0.5}
                              disabled={updateHours.isPending}
                              invalid={false}
                              className="ml-auto w-28"
                              onBlur={() => undefined}
                              onChange={setEditHours}
                            />
                          ) : (
                            <span className="tabular-nums">
                              {entry.estimatedHours} h
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={editReason}
                              placeholder="Motivo del ajuste"
                              disabled={updateHours.isPending}
                              onChange={(event) =>
                                setEditReason(event.target.value)
                              }
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {entry.isAutomatic
                                ? "Automático"
                                : entry.adjustmentReason.length > 0
                                  ? entry.adjustmentReason
                                  : "Ajuste manual"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                size="icon-sm"
                                disabled={updateHours.isPending}
                                onClick={() => void handleSave(entry)}
                              >
                                <CheckIcon />
                                <span className="sr-only">Guardar</span>
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                disabled={updateHours.isPending}
                                onClick={() => setEditingId("")}
                              >
                                <XIcon />
                                <span className="sr-only">Cancelar</span>
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={!canWrite}
                              onClick={() => handleStartEdit(entry)}
                            >
                              <PencilIcon />
                              <span className="sr-only">Ajustar horas</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      })}
      <div className="flex justify-end border-t pt-3 text-sm font-semibold">
        <span>
          Esfuerzo total:{" "}
          <span className="text-primary tabular-nums">
            {totalHours.toFixed(1)} h
          </span>
        </span>
      </div>
    </div>
  )
}
