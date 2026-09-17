export const formatDate = (
  value: string,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }
) => new Intl.DateTimeFormat("es-CO", options).format(new Date(value))

export const CURRENCY_CODE = "PEN" as const

export type CurrencyCode = typeof CURRENCY_CODE

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const roundMoney = (value: number) => Math.round(value * 100) / 100
