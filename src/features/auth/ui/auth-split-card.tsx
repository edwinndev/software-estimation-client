import type { ReactNode } from "react"
import Image from "next/image"

export const AuthSplitCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-card grid min-h-[560px] overflow-hidden rounded-2xl shadow-xl lg:grid-cols-2">
      <div className="relative hidden min-h-[560px] lg:block">
        <Image
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 0px"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute right-8 bottom-8 left-8 text-white">
          <p className="text-2xl font-semibold tracking-tight">
            Estima software en un solo lugar
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/80">
            Proyectos, costos y accesos conectados para tu equipo.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">{children}</div>
    </div>
  )
}
