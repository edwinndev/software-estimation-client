"use client"

import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/datepicker"

type DateRangeFieldsProps = {
  startId?: string
  endId?: string
  startLabel: string
  endLabel: string
  startValue?: Date
  endValue?: Date
  onStartSelect: (date: Date) => void
  onEndSelect: (date: Date) => void
  startError?: string
  endError?: string
  required?: boolean
  startPlaceholder?: string
  endPlaceholder?: string
}

export const DateRangeFields = ({
  startId,
  endId,
  startLabel,
  endLabel,
  startValue,
  endValue,
  onStartSelect,
  onEndSelect,
  startError,
  endError,
  required = true,
  startPlaceholder,
  endPlaceholder,
}: DateRangeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={startId}>
          {startLabel}
          {required ? (
            <>
              {" "}
              <span className="text-destructive">*</span>
            </>
          ) : null}
        </Label>
        <DatePicker
          id={startId}
          value={startValue}
          maxDate={endValue}
          invalid={Boolean(startError)}
          placeholder={startPlaceholder}
          onSelect={onStartSelect}
        />
        {startError ? (
          <p className="text-destructive text-xs">{startError}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={endId}>
          {endLabel}
          {required ? (
            <>
              {" "}
              <span className="text-destructive">*</span>
            </>
          ) : null}
        </Label>
        <DatePicker
          id={endId}
          value={endValue}
          minDate={startValue}
          invalid={Boolean(endError)}
          placeholder={endPlaceholder}
          onSelect={onEndSelect}
        />
        {endError ? (
          <p className="text-destructive text-xs">{endError}</p>
        ) : null}
      </div>
    </div>
  )
}
