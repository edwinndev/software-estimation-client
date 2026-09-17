"use client"

import { MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type NumberInputProps = {
  id: string
  value: number
  min: number
  max: number
  step: number
  disabled: boolean
  invalid: boolean
  className: string
  onChange: (value: number) => void
  onBlur: () => void
}

const toFiniteNumber = (value: number) => (Number.isFinite(value) ? value : 0)

const stepDecimals = (step: number) => {
  const parts = String(step).split(".")
  if (parts.length < 2) {
    return 0
  }
  return parts[1].length
}

const roundToStep = (value: number, step: number) => {
  const rounded = Math.round(value / step) * step
  return Number(rounded.toFixed(stepDecimals(step)))
}

const clamp = (value: number, min: number, max: number, step: number) => {
  const safe = toFiniteNumber(value)
  const lower = min < 0 ? min : 0
  if (safe <= 0 && lower === 0) {
    return 0
  }
  const next = roundToStep(safe, step)
  if (next < lower) {
    return lower
  }
  if (next > max) {
    return max
  }
  return next
}

export const NumberInput = ({
  id,
  value,
  min,
  max,
  step,
  disabled,
  invalid,
  className,
  onChange,
  onBlur,
}: NumberInputProps) => {
  const current = clamp(value, min, max, step)
  const lower = min < 0 ? min : 0
  const canDecrease = !disabled && current > lower
  const canIncrease = !disabled && current < max

  const commit = (next: number) => {
    onChange(clamp(next, min, max, step))
  }

  return (
    <div
      aria-invalid={invalid}
      className={cn(
        "border-input bg-background dark:bg-input/30 has-focus-visible:border-ring has-focus-visible:ring-ring/25 aria-invalid:border-destructive flex h-8 w-full overflow-hidden rounded-md border has-focus-visible:ring-1",
        disabled ? "opacity-50" : "",
        className
      )}
    >
      <button
        type="button"
        disabled={!canDecrease}
        aria-label="Disminuir"
        className="hover:bg-muted flex size-8 shrink-0 items-center justify-center border-r disabled:pointer-events-none disabled:opacity-50"
        onClick={() => commit(current - step)}
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        aria-invalid={invalid}
        disabled={disabled}
        value={String(current)}
        onBlur={onBlur}
        onChange={(event) => {
          const raw = event.target.value.trim()
          if (raw.length === 0) {
            commit(0)
            return
          }
          commit(Number(raw))
        }}
        className="h-8 min-w-0 flex-1 bg-transparent px-2 text-center text-sm outline-none disabled:cursor-not-allowed"
      />
      <button
        type="button"
        disabled={!canIncrease}
        aria-label="Aumentar"
        className="hover:bg-muted flex size-8 shrink-0 items-center justify-center border-l disabled:pointer-events-none disabled:opacity-50"
        onClick={() => commit(current + step)}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  )
}
