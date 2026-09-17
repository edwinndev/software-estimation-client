"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  id?: string
  value?: Date
  onSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
}

export const DatePicker = ({
  id,
  value,
  onSelect,
  minDate,
  maxDate,
  placeholder = "Selecciona una fecha",
  invalid = false,
  disabled = false,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            id={id}
            variant="outline"
            data-empty={!value}
            aria-invalid={invalid}
            className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
          />
        }
      >
        {value ? (
          format(value, "PPP", { locale: es })
        ) : (
          <span>{placeholder}</span>
        )}
        <CalendarIcon className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value ?? minDate ?? maxDate}
          minDate={minDate}
          maxDate={maxDate}
          onSelect={(date) => {
            if (date) onSelect(date)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
