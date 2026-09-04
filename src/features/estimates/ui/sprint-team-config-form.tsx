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
import { SaveIcon } from "lucide-react"

import {
  useSaveSprintConfig,
  useSprintConfig,
} from "../hooks/use-sprint-config"
import type { SprintConfig } from "../types"

/**
 * PMGT-33 + PMGT-35: Configuración del Equipo y Sprint (Paso 5 de la
 * especificación) — un solo formulario, un solo botón "Guardar Configuración".
 * Persiste en localStorage bajo "sprint-config" vía TanStack Query.
 */
export const SprintTeamConfigForm = () => {
  const { data: config, isLoading } = useSprintConfig()

  if (isLoading || !config) {
    return (
      <p className="text-muted-foreground text-sm">Cargando configuración...</p>
    )
  }

  return <SprintTeamConfigFields initialConfig={config} />
}

const SprintTeamConfigFields = ({
  initialConfig,
}: {
  initialConfig: SprintConfig
}) => {
  const saveConfig = useSaveSprintConfig()

  const [velocity, setVelocity] = useState(String(initialConfig.velocity))
  const [duration, setDuration] = useState(String(initialConfig.duration))
  const [unit, setUnit] = useState<SprintConfig["unit"]>(initialConfig.unit)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    saveConfig.mutate(
      { velocity: Number(velocity), duration: Number(duration), unit },
      { onSuccess: () => setSaved(true) }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="velocity">Velocidad del equipo (SP/sprint)</Label>
        <Input
          id="velocity"
          type="number"
          min={1}
          value={velocity}
          onChange={(event) => {
            setVelocity(event.target.value)
            setSaved(false)
          }}
          placeholder="Ej. 20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="duration">Duración del Sprint</Label>
        <div className="flex gap-2">
          <Input
            id="duration"
            type="number"
            min={1}
            value={duration}
            onChange={(event) => {
              setDuration(event.target.value)
              setSaved(false)
            }}
            className="w-24"
          />
          <Select
            value={unit}
            onValueChange={(value) => {
              setUnit((value as SprintConfig["unit"]) ?? "semanas")
              setSaved(false)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dias">Días</SelectItem>
              <SelectItem value="semanas">Semanas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saveConfig.isPending}>
          <SaveIcon data-icon="inline-start" />
          {saveConfig.isPending ? "Guardando..." : "Guardar Configuración"}
        </Button>
        {saved && !saveConfig.isPending && (
          <span className="text-muted-foreground text-sm">
            Configuración guardada ✓
          </span>
        )}
      </div>
    </form>
  )
}
