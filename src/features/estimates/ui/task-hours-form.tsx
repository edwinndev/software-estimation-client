"use client"

import { useState } from "react"
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

interface TechnicalProfileItem {
  id: string
  name: string
}

const MOCK_TASKS = [
  { id: "t1", title: "Diseñar endpoint de login" },
  { id: "t2", title: "Crear tabla de usuarios en BD" },
  { id: "t3", title: "Maquetar pantalla de listado" },
]

const FALLBACK_TECHNICAL_PROFILES: TechnicalProfileItem[] = [
  { id: "p1", name: "Backend" },
  { id: "p2", name: "Frontend" },
  { id: "p3", name: "QA" },
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

  // Inicialización tipada sin usar any
  const [profiles] = useState<TechnicalProfileItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY)
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

    const task = MOCK_TASKS.find((item) => item.id === taskId)
    if (!task) return

    const newEntries: HoursEntry[] = profileRows.map((row) => {
      const profile = profiles.find((item) => item.id === row.profileId)
      return {
        taskId,
        taskTitle: task.title,
        profileId: row.profileId,
        profileName: profile ? profile.name : "",
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
      {/* Selector de Tarea */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task" className="text-sm font-medium">
          Tarea
        </Label>
        <Select
          value={taskId}
          onValueChange={(value) => setTaskId(value ?? "")}
        >
          <SelectTrigger id="task" className="w-full">
            <SelectValue placeholder="Selecciona una tarea" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_TASKS.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Perfil y Horas con etiquetas arriba bien alineadas */}
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
                  updateProfileRow(row.rowId, "profileId", value ?? "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona perfil técnico" />
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
