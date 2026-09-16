import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface StoryDetailProps {
  children: ReactNode
}

export const StoryDetail = ({ children }: StoryDetailProps) => (
  <Card>{children}</Card>
)
