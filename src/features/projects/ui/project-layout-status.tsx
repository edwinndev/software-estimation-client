"use client"

import { useParams } from "next/navigation"
import { ProjectStatusBanner } from "./project-status-banner"

export const ProjectLayoutStatus = () => {
  const params = useParams()
  const projectId = typeof params.projectId === "string" ? params.projectId : ""

  if (!projectId) {
    return null
  }

  return <ProjectStatusBanner projectId={projectId} />
}
