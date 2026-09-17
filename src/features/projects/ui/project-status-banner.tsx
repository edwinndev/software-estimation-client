import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
} from "../types/project-status"
import { useProjectAccess } from "../hooks/use-project-access"

type ProjectStatusBannerProps = {
  projectId: string
}

export const ProjectStatusBanner = ({
  projectId,
}: ProjectStatusBannerProps) => {
  const access = useProjectAccess(projectId)

  if (access.isLoading || !access.project) {
    return null
  }

  return (
    <Alert>
      <InfoIcon />
      <AlertTitle className="flex items-center gap-2">
        Estado
        <Badge variant={PROJECT_STATUS_VARIANTS[access.status]}>
          {PROJECT_STATUS_LABELS[access.status]}
        </Badge>
      </AlertTitle>
      <AlertDescription>{access.hint}</AlertDescription>
    </Alert>
  )
}
