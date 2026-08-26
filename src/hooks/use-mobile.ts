import * as React from "react"

const MOBILE_BREAKPOINT = 768

export const useIsMobile = (): boolean => {
  return React.useSyncExternalStore(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      mql.addEventListener("change", onStoreChange)
      return () => {
        mql.removeEventListener("change", onStoreChange)
      }
    },
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false
  )
}
