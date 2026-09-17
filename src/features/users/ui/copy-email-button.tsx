"use client"

import { CopyIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CopyEmailButtonProps = {
  email: string
}

export const CopyEmailButton = ({ email }: CopyEmailButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        onClick={() => {
          void navigator.clipboard.writeText(email).then(
            () => {
              toast.add({
                title: "Correo copiado",
                description: `${email} se copió al portapapeles.`,
                type: "success",
              })
            },
            () => {
              toast.add({
                title: "No se pudo copiar el correo",
                description: "Inténtalo de nuevo o cópialo de forma manual.",
                type: "error",
              })
            }
          )
        }}
      >
        <CopyIcon />
        <span className="sr-only">Copiar correo</span>
      </TooltipTrigger>
      <TooltipContent>Copiar correo</TooltipContent>
    </Tooltip>
  )
}
