import type { ReactNode } from "react"

interface StoryListProps {
  children: ReactNode
}

export const StoryList = ({ children }: StoryListProps) => (
  <div className="grid gap-4">{children}</div>
)
