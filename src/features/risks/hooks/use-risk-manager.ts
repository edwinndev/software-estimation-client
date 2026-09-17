import { useState, useMemo } from "react"
import { riskService } from "../services/risk-service"
import { RiskLevel } from "../types"

interface UseRiskManagerProps {
  projectId: string
  baseTime: number
  baseCost: number
}

export const useRiskManager = ({
  projectId,
  baseTime,
  baseCost,
}: UseRiskManagerProps) => {
  const [level, setLevel] = useState<RiskLevel>("medium")
  const [margin, setMargin] = useState<number>(15)

  const impact = useMemo(() => {
    return riskService.calculateImpact(baseTime, baseCost, margin)
  }, [baseTime, baseCost, margin])

  const handleLevelChange = (newLevel: RiskLevel) => {
    setLevel(newLevel)
    const defaultMargin = riskService.getDefaultMargin(newLevel)
    setMargin(defaultMargin)
  }

  const handleMarginChange = (newMargin: number) => {
    const safeMargin = Math.max(0, Math.min(100, newMargin))
    setMargin(safeMargin)
  }

  const handleSave = async () => {
    await riskService.saveConfig(projectId, {
      level,
      contingencyMargin: margin,
    })
  }

  const handleCancel = () => {
    setLevel("medium")
    setMargin(15)
  }

  return {
    level,
    margin,
    impact,
    handleLevelChange,
    handleMarginChange,
    handleSave,
    handleCancel,
  }
}
