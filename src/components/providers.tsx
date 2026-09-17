"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"

const RouteScrollReset = () => {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.removeProperty("overflow")
    document.documentElement.style.removeProperty("overflow")
  }, [pathname])

  return null
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouteScrollReset />
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
