import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    return dateString
  }
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return "N/A"

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + "B"
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M"
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + "K"
  } else {
    return value.toFixed(2)
  }
}
