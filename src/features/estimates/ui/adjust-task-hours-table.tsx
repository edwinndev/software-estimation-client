"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PencilIcon, CheckIcon, XIcon } from "lucide-react"

const TASK_HOURS_STORAGE_KEY = "task-hours-entries"

interface TaskEntry {
  taskId: string
  taskTitle: string
  profileId: string
  profileName: string
  hours: number
  adjustmentReason?: string
  updatedAt?: string
}

export const AdjustTaskHoursTable = () => {
  // Inicialización limpia desde localStorage
  const [entries, setEntries] = useState<TaskEntry[]>(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(TASK_HOURS_STORAGE_KEY)
      if (data) {
        try {
          return JSON.parse(data)
        } catch {
          // fallback
        }
      }
    }
    return []
  })

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editHours, setEditHours] = useState<number>(0)
  const [editReason, setEditReason] = useState<string>("")

  const reloadEntries = () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(TASK_HOURS_STORAGE_KEY)
      if (data) {
        try {
          setEntries(JSON.parse(data))
        } catch {
          // fallback
        }
      }
    }
  }

  useEffect(() => {
    const handleUpdate = () => reloadEntries()
    window.addEventListener("task-hours-updated", handleUpdate)
    return () => window.removeEventListener("task-hours-updated", handleUpdate)
  }, [])

  const handleStartEdit = (index: number, currentHours: number) => {
    setEditingIndex(index)
    setEditHours(currentHours)
    setEditReason("")
  }

  const handleSaveAdjustment = (index: number) => {
    if (editHours <= 0) return

    const updated = entries.map((entry, i) => {
      if (i === index) {
        return {
          ...entry,
          hours: Number(editHours),
          adjustmentReason: editReason.trim() || "Ajuste manual de horas",
          updatedAt: new Date().toISOString(),
        }
      }
      return entry
    })

    setEntries(updated)
    localStorage.setItem(TASK_HOURS_STORAGE_KEY, JSON.stringify(updated))
    setEditingIndex(null)
  }

  return (
    <div className="border-border/70 mt-4 w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-xs font-semibold">Tarea</TableHead>
            <TableHead className="text-xs font-semibold">Perfil</TableHead>
            <TableHead className="w-28 text-right text-xs font-semibold">
              Horas
            </TableHead>
            <TableHead className="text-xs font-semibold">
              Motivo de Ajuste
            </TableHead>
            <TableHead className="w-24 text-center text-xs font-semibold">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground py-6 text-center text-sm"
              >
                Todavía no hay horas registradas. Usa el formulario de arriba
                para registrar una.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry, index) => {
              const isEditing = editingIndex === index

              return (
                <TableRow
                  key={`${entry.taskId}-${entry.profileId}-${index}`}
                  className="hover:bg-muted/30"
                >
                  <TableCell className="text-xs font-medium">
                    {entry.taskTitle}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {entry.profileName}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        step={0.5}
                        min={0.5}
                        value={editHours}
                        onChange={(e) => setEditHours(Number(e.target.value))}
                        className="ml-auto h-7 w-20 text-right text-xs"
                        autoFocus
                      />
                    ) : (
                      <span className="font-mono text-xs font-semibold">
                        {entry.hours}h
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {isEditing ? (
                      <Input
                        type="text"
                        placeholder="Motivo del ajuste..."
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        className="h-7 text-xs"
                      />
                    ) : (
                      <span className="text-muted-foreground text-[11px] italic">
                        {entry.adjustmentReason || "—"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="xs"
                          onClick={() => handleSaveAdjustment(index)}
                          className="h-7 px-2 text-xs"
                          title="Guardar ajuste"
                        >
                          <CheckIcon className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setEditingIndex(null)}
                          className="h-7 px-2 text-xs"
                          title="Cancelar"
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(index, entry.hours)}
                        className="text-muted-foreground hover:text-foreground size-7"
                        title="Ajustar horas"
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
