"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { riskService } from "../services/risk-service"
import type { RiskLevel } from "../types"

type UseRiskManagerProps = {
  projectId: string
  baseTime: number
  baseCost: number
}

export const RISK_CONFIG_QUERY_KEY = ["risk-config"]

const DEFAULT_LEVEL: RiskLevel = "medium"
const DEFAULT_MARGIN = 15

export const useRiskManager = ({
  projectId,
  baseTime,
  baseCost,
}: UseRiskManagerProps) => {
  const queryClient = useQueryClient()
  const { data: savedConfig, isLoading } = useQuery({
    queryKey: [...RISK_CONFIG_QUERY_KEY, projectId],
    queryFn: () => riskService.getConfig(projectId),
  })
  const [isDirty, setIsDirty] = useState(false)
  const [draftLevel, setDraftLevel] = useState<RiskLevel>(DEFAULT_LEVEL)
  const [draftMargin, setDraftMargin] = useState(DEFAULT_MARGIN)

  const savedLevel = savedConfig ? savedConfig.level : DEFAULT_LEVEL
  const savedMargin = savedConfig
    ? savedConfig.contingencyMargin
    : DEFAULT_MARGIN
  const level = isDirty ? draftLevel : savedLevel
  const margin = isDirty ? draftMargin : savedMargin

  const saveConfig = useMutation({
    mutationFn: () =>
      riskService.saveConfig(projectId, {
        level,
        contingencyMargin: margin,
      }),
    onSuccess: (config) => {
      queryClient.setQueryData([...RISK_CONFIG_QUERY_KEY, projectId], config)
      setDraftLevel(config.level)
      setDraftMargin(config.contingencyMargin)
      setIsDirty(false)
      invalidateReportQueries(queryClient)
    },
  })

  const impact = useMemo(() => {
    return riskService.calculateImpact(baseTime, baseCost, margin)
  }, [baseTime, baseCost, margin])

  const handleLevelChange = (newLevel: RiskLevel) => {
    setDraftLevel(newLevel)
    setDraftMargin(riskService.getDefaultMargin(newLevel))
    setIsDirty(true)
  }

  const handleMarginChange = (newMargin: number) => {
    setDraftLevel(level)
    setDraftMargin(Math.max(0, Math.min(100, newMargin)))
    setIsDirty(true)
  }

  const handleCancel = () => {
    setDraftLevel(savedLevel)
    setDraftMargin(savedMargin)
    setIsDirty(false)
  }

  return {
    level,
    margin,
    impact,
    isLoading,
    isSaving: saveConfig.isPending,
    handleLevelChange,
    handleMarginChange,
    saveConfig,
    handleCancel,
  }
}
