import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react"
import { RiskLevel } from "../types"
import { cn } from "@/lib/utils"

interface RiskLevelSelectorProps {
  currentLevel: RiskLevel
  onLevelChange: (level: RiskLevel) => void
}

export const RiskLevelSelector = ({
  currentLevel,
  onLevelChange,
}: RiskLevelSelectorProps) => {
  const options = [
    {
      id: "low",
      label: "Bajo (Low)",
      icon: ShieldCheck,
      color: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      id: "medium",
      label: "Medio (Medium)",
      icon: AlertTriangle,
      color: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    {
      id: "high",
      label: "Alto (High)",
      icon: AlertOctagon,
      color: "bg-red-600 hover:bg-red-700 text-white",
    },
  ]

  return (
    <div className="mb-4 flex gap-2">
      {options.map((opt) => (
        <Button
          key={opt.id}
          variant={currentLevel === opt.id ? "default" : "outline"}
          className={cn(
            "flex-1 gap-2 transition-all",
            currentLevel === opt.id
              ? `${opt.color} border-transparent shadow-md`
              : "text-muted-foreground border-input hover:bg-accent"
          )}
          onClick={() => onLevelChange(opt.id as RiskLevel)}
        >
          <opt.icon className="h-4 w-4" />
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
