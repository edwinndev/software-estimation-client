import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

const NewProjectPage = () => {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo proyecto</h1>
          <p className="text-muted-foreground text-sm">
            Registra un nuevo proyecto con estado inicial borrador.
          </p>
        </div>
        <Link
          href="/projects"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancelar
        </Link>
      </div>
    </div>
  )
}

export default NewProjectPage
