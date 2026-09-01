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
