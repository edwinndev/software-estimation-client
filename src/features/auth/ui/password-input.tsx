"use client"

import * as React from "react"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, disabled, ...props }, ref) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/25 disabled:bg-muted/40 disabled:text-foreground/85 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-muted/30 dark:disabled:text-foreground/85 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 pr-9 text-base transition-colors outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-90 aria-invalid:ring-1 md:text-sm",
          className
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setVisible((previous) => !previous)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 z-10 -translate-y-1/2 flex items-center justify-center p-0.5 rounded transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        {visible ? (
          <EyeOffIcon className="size-4 shrink-0" />
        ) : (
          <EyeIcon className="size-4 shrink-0" />
        )}
      </button>
    </div>
  )
})

PasswordInput.displayName = "PasswordInput"
