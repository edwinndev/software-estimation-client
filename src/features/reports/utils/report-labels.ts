export const riskLevelLabel = (level: string) => {
  if (level === "low") {
    return "Bajo"
  }
  if (level === "high") {
    return "Alto"
  }
  return "Medio"
}

export const projectStatusLabel = (status: string) => {
  if (status === "borrador") {
    return "Borrador"
  }
  if (status === "en_evaluacion") {
    return "En evaluación"
  }
  if (status === "estimado") {
    return "Estimado"
  }
  if (status === "aprobado") {
    return "Aprobado"
  }
  if (status === "rechazado") {
    return "Rechazado"
  }
  if (status === "en_ejecucion") {
    return "En ejecución"
  }
  if (status === "finalizado") {
    return "Finalizado"
  }
  return status
}

export const projectTypeLabel = (type: string) => {
  if (type === "monitoreo") {
    return "Monitoreo IoT"
  }
  if (type === "automatizacion") {
    return "Automatización IoT"
  }
  if (type === "monitoreo_automatizacion") {
    return "Monitoreo y automatización IoT"
  }
  if (type === "telemetria") {
    return "Telemetría IoT"
  }
  if (type === "control_supervision") {
    return "Control y supervisión IoT"
  }
  if (type === "mantenimiento_predictivo") {
    return "Mantenimiento predictivo IoT"
  }
  if (type === "integracion") {
    return "Integración IoT"
  }
  if (type === "investigacion") {
    return "Integración IoT"
  }
  return type
}

export type ReportBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "muted"
  | "success"
  | "warning"
  | "info"

export const projectStatusVariant = (status: string): ReportBadgeVariant => {
  if (status === "borrador") {
    return "muted"
  }
  if (status === "en_evaluacion") {
    return "warning"
  }
  if (status === "estimado") {
    return "info"
  }
  if (status === "aprobado") {
    return "success"
  }
  if (status === "rechazado") {
    return "destructive"
  }
  if (status === "en_ejecucion") {
    return "default"
  }
  if (status === "finalizado") {
    return "secondary"
  }
  return "outline"
}

export const riskLevelVariant = (level: string): ReportBadgeVariant => {
  if (level === "low") {
    return "success"
  }
  if (level === "high") {
    return "destructive"
  }
  return "warning"
}
