import type { ProjectCostSummary } from "../types/project-cost-summary"
import { CostsEmptyState } from "./costs-empty-state"
import { ProfileCostBreakdownTable } from "./profile-cost-breakdown-table"
import { ProjectCostSummaryCard } from "./project-cost-summary-card"
import { TaskCostsTable } from "./task-costs-table"

interface CostsViewProps {
  projectId: string
  summary?: ProjectCostSummary
}

export const CostsView = ({ projectId, summary }: CostsViewProps) => {
  const isEmpty =
    !summary ||
    (summary.taskCosts.length === 0 && summary.profileBreakdown.length === 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cálculo de costos</h1>
        <p className="text-muted-foreground text-sm">
          Desglose de costos totales y por perfil técnico (CER) para el proyecto
          #{projectId}.
        </p>
      </div>

      {isEmpty ? (
        <CostsEmptyState />
      ) : (
        <>
          <ProjectCostSummaryCard totalCost={summary.totalCost} />
          <TaskCostsTable taskCosts={summary.taskCosts} />
          <ProfileCostBreakdownTable
            profileBreakdown={summary.profileBreakdown}
          />
        </>
      )}
    </div>
  )
}
