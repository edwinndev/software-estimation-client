import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Small utility note: keeps Tailwind class merging predictable across the app.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
