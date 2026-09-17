"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusIcon, SaveIcon, XIcon } from "lucide-react"

const TASK_HOURS_STORAGE_KEY = "task-hours-entries"
const PROFILES_STORAGE_KEY = "intecx_profiles"
const getBacklogKey = (projectId: string = "1") =>
  `software-estimation:backlog:${projectId}`

interface TechnicalProfileItem {
  id: string
  name: string
}

interface TaskItem {
  id: string
  title: string
}

const FALLBACK_TECHNICAL_PROFILES: TechnicalProfileItem[] = [
  { id: "Frontend", name: "Frontend" },
  { id: "Backend", name: "Backend" },
  { id: "Fullstack", name: "Fullstack" },
  { id: "QA", name: "QA" },
  { id: "DevOps", name: "DevOps" },
  { id: "UI/UX Designer", name: "UI/UX Designer" },
  { id: "Product Manager", name: "Product Manager" },
  { id: "Tech Lead", name: "Tech Lead" },
  { id: "Functional Analyst", name: "Functional Analyst" },
]

interface ProfileAssignment {
  rowId: string
  profileId: string
  hours: string
}

export interface HoursEntry {
  taskId: string
  taskTitle: string
  profileId: string
  profileName: string
  hours: number
  adjustmentReason?: string
  updatedAt?: string
}

const createEmptyRow = (): ProfileAssignment => ({
  rowId: crypto.randomUUID(),
  profileId: "",
  hours: "",
})

export const TaskHoursForm = () => {
  const [taskId, setTaskId] = useState("")

  const loadTasksFromStorage = (): TaskItem[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(getBacklogKey("1"))
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          tasks?: Array<{ id: string; title?: string; name?: string }>
        }
        if (parsed.tasks && parsed.tasks.length > 0) {
          return parsed.tasks.map((t) => ({
            id: t.id,
            title: t.title || t.name || "Tarea sin título",
          }))
        }
      } catch {
        return []
      }
    }
    return []
  }

  const [tasks, setTasks] = useState<TaskItem[]>(loadTasksFromStorage)

  const [profiles] = useState<TechnicalProfileItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved =
        localStorage.getItem(PROFILES_STORAGE_KEY) ||
        localStorage.getItem("profiles")
      if (saved) {
        try {
          return JSON.parse(saved) as TechnicalProfileItem[]
        } catch {
          // fallback
        }
      }
    }
    return FALLBACK_TECHNICAL_PROFILES
  })

  const [profileRows, setProfileRows] = useState<ProfileAssignment[]>([
    createEmptyRow(),
  ])

  useEffect(() => {
    const handleStorage = () => setTasks(loadTasksFromStorage())
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Encontrar la tarea seleccionada para extraer su título
  const selectedTask = tasks.find((t) => t.id === taskId)

  const addProfileRow = () => {
    setProfileRows([...profileRows, createEmptyRow()])
  }

  const removeProfileRow = (rowId: string) => {
    setProfileRows(profileRows.filter((row) => row.rowId !== rowId))
  }

  const updateProfileRow = (
    rowId: string,
    field: "profileId" | "hours",
    value: string
  ) => {
    setProfileRows(
      profileRows.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row
      )
    )
  }

  const isRowComplete = (row: ProfileAssignment) =>
    row.profileId !== "" && row.hours !== ""

  const canSubmit =
    taskId !== "" && profileRows.length > 0 && profileRows.every(isRowComplete)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    const taskRealName = selectedTask ? selectedTask.title : "Tarea Técnica"

    const newEntries: HoursEntry[] = profileRows.map((row) => {
      const profile = profiles.find((item) => item.id === row.profileId)
      return {
        taskId,
        taskTitle: taskRealName,
        profileId: row.profileId,
        profileName: profile ? profile.name : row.profileId,
        hours: Number(row.hours),
        updatedAt: new Date().toISOString(),
      }
    })

    const saved = localStorage.getItem(TASK_HOURS_STORAGE_KEY)
    const current = saved ? (JSON.parse(saved) as HoursEntry[]) : []
    const updated = [...current, ...newEntries]

    localStorage.setItem(TASK_HOURS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event("task-hours-updated"))

    setTaskId("")
    setProfileRows([createEmptyRow()])
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Selector de Tarea mostrando el nombre legible */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task" className="text-sm font-medium">
          Tarea
        </Label>
        <Select
          value={taskId}
          onValueChange={(value) => setTaskId(value || "")}
        >
          <SelectTrigger id="task" className="w-full">
            <SelectValue placeholder="Selecciona una tarea">
              {/* Le forzamos a pintar el nombre de la tarea */}
              {selectedTask ? selectedTask.title : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Perfil y Horas */}
      <div className="flex flex-col gap-3">
        {profileRows.map((row, index) => (
          <div
            key={row.rowId}
            className="grid grid-cols-1 items-end gap-2 sm:grid-cols-12"
          >
            <div className="flex flex-col gap-1.5 sm:col-span-8">
              {index === 0 && (
                <Label className="text-sm font-medium">Perfil técnico</Label>
              )}
              <Select
                value={row.profileId}
                onValueChange={(value) =>
                  updateProfileRow(row.rowId, "profileId", value || "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona perfil técnico">
                    {profiles.find((p) => p.id === row.profileId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-3">
              {index === 0 && (
                <Label className="text-sm font-medium">Horas</Label>
              )}
              <Input
                type="number"
                min={0.5}
                step={0.5}
                value={row.hours}
                onChange={(event) =>
                  updateProfileRow(row.rowId, "hours", event.target.value)
                }
                placeholder="Ej. 8"
                className="w-full"
              />
            </div>

            <div className="flex justify-center pb-0.5 sm:col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={profileRows.length === 1}
                onClick={() => removeProfileRow(row.rowId)}
                className="text-muted-foreground hover:text-destructive"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Quitar perfil</span>
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProfileRow}
          className="w-fit gap-1 text-xs"
        >
          <PlusIcon className="size-3.5" />+ Agregar perfil
        </Button>
      </div>

      <Button
        type="submit"
        disabled={!canSubmit}
        className="mt-1 w-fit gap-1.5"
      >
        <SaveIcon className="size-4" />
        Guardar estimación
      </Button>
    </form>
  )
}
