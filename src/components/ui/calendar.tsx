"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = es,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("bg-popover p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col gap-4", defaultClassNames.months),
        month: cn("flex flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center justify-between absolute inset-x-0 top-0",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "size-7 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "size-7 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-7 w-full px-8 text-sm font-medium",
          defaultClassNames.month_caption
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 text-[0.8rem] font-normal select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1.5 flex w-full", defaultClassNames.week),
        day: cn(
          "relative flex-1 p-0 text-center text-sm [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day",
          defaultClassNames.day
        ),
        day_button: cn(
          "size-8 rounded-md p-0 font-normal transition-colors hover:bg-muted aria-selected:opacity-100",
          defaultClassNames.day_button
        ),
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          defaultClassNames.selected
        ),
        today: cn(
          "[&>button]:bg-accent [&>button]:text-accent-foreground",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground opacity-50 aria-selected:opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="size-4" {...chevronProps} />
          }
          return <ChevronRightIcon className="size-4" {...chevronProps} />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
