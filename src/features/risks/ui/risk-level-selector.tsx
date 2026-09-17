import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RiskLevel } from "../types"

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
  const options: {
    id: RiskLevel
    label: string
    icon: typeof ShieldCheck
    color: string
  }[] = [
    {
      id: "low",
      label: "Bajo",
      icon: ShieldCheck,
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      id: "medium",
      label: "Medio",
      icon: AlertTriangle,
      color: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    {
      id: "high",
      label: "Alto",
      icon: AlertOctagon,
      color: "bg-red-600 hover:bg-red-700 text-white",
    },
  ]

  return (
    <div className="mb-4 flex gap-2">
      {options.map((opt) => (
        <Button
          key={opt.id}
          type="button"
          variant={currentLevel === opt.id ? "default" : "outline"}
          className={cn(
            "flex-1 gap-2 transition-all",
            currentLevel === opt.id
              ? `${opt.color} border-transparent shadow-md`
              : "text-muted-foreground border-input hover:bg-accent"
          )}
          disabled={disabled}
          onClick={() => onLevelChange(opt.id)}
        >
          <opt.icon className="h-4 w-4" />
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
