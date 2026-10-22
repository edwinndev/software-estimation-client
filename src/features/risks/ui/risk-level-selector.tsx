"use client"

import { Button } from "@/components/ui/button"
import { RISK_LEVEL_OPTIONS, type RiskLevel } from "@/enumeration/risk-level"
import { cn } from "@/lib/utils"

type RiskLevelSelectorProps = {
  currentLevel: RiskLevel
  onLevelChange: (level: RiskLevel) => void
  disabled: boolean
}

export const RiskLevelSelector = ({
  currentLevel,
  onLevelChange,
  disabled,
}: RiskLevelSelectorProps) => {
  return (
    <div className="mb-4 flex gap-2">
      {RISK_LEVEL_OPTIONS.map((option) => {
        const Icon = option.icon
        const isSelected = currentLevel === option.value

        return (
          <Button
            key={option.value}
            type="button"
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "flex-1 gap-2 transition-all",
              isSelected
                ? `${option.buttonClassName} border-transparent shadow-md`
                : "text-muted-foreground border-input hover:bg-accent"
            )}
            disabled={disabled}
            onClick={() => onLevelChange(option.value)}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
