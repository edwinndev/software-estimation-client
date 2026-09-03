"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckIcon } from "lucide-react"

import { useAssignStoryPoints, useUserStories } from "../hooks/use-user-stories"
import { STORY_POINTS_OPTIONS } from "../types"

/**
 * PMGT-36: Asignar Story Points a una historia de usuario EXISTENTE.
 * Lee las historias de "user-stories" (dato ajeno) y guarda la asignación
 * en "story-points-assignments" (dato propio) vía localStorage.
 */
export const AssignStoryPointsForm = () => {
  const { data: stories = [], isLoading } = useUserStories()
  const assignPoints = useAssignStoryPoints()

  const [selectedStoryId, setSelectedStoryId] = useState("")
  const [storyPoints, setStoryPoints] = useState<string>("")
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedStoryId || !storyPoints) return

    assignPoints.mutate(
      { storyId: selectedStoryId, points: Number(storyPoints) },
      {
        onSuccess: () => {
          setSaved(true)
          setSelectedStoryId("")
          setStoryPoints("")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="story">Historia de usuario</Label>
        <Select
          value={selectedStoryId}
          onValueChange={(value) => {
            setSelectedStoryId(value ?? "")
            setSaved(false)
          }}
        >
          <SelectTrigger id="story" className="w-full">
            <SelectValue
              placeholder={
                isLoading ? "Cargando historias..." : "Selecciona una historia"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {stories.map((story) => (
              <SelectItem key={story.id} value={story.id}>
                {story.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="storyPoints">Story Points</Label>
        <Select
          value={storyPoints}
          onValueChange={(value) => {
            setStoryPoints(value ?? "")
            setSaved(false)
          }}
        >
          <SelectTrigger id="storyPoints" className="w-full">
            <SelectValue placeholder="Selecciona Story Points" />
          </SelectTrigger>
          <SelectContent>
            {STORY_POINTS_OPTIONS.map((points) => (
              <SelectItem key={points} value={String(points)}>
                {points} SP
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!selectedStoryId || !storyPoints || assignPoints.isPending}
        >
          <CheckIcon data-icon="inline-start" />
          {assignPoints.isPending ? "Asignando..." : "Asignar puntos"}
        </Button>
        {saved && !assignPoints.isPending && (
          <span className="text-muted-foreground text-sm">Asignado ✓</span>
        )}
      </div>
    </form>
  )
}
