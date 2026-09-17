import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { COMPANY, COMPANY_LOGO_SRC } from "@/lib/company"
import { formatCurrency, formatDate } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import type { GlobalSystemReport, ReportSnapshot } from "../types"
import {
  projectStatusLabel,
  projectTypeLabel,
  riskLevelLabel,
} from "../utils/report-labels"

const FONT = "helvetica"
const SIZE_BODY = 11
const SIZE_TITLE = 12
const LINE_SPACING = 1.5
const MARGIN_X = 20
const MARGIN_TOP = 18
const MARGIN_BOTTOM = 18
const INK: [number, number, number] = [33, 33, 33]
const MUTED: [number, number, number] = [90, 90, 90]
const LINE: [number, number, number] = [180, 180, 180]
const HEAD_FILL: [number, number, number] = [242, 242, 242]

const lineHeightMm = (size: number) => (size * LINE_SPACING * 25.4) / 72

const applyBody = (doc: jsPDF) => {
  doc.setFont(FONT, "normal")
  doc.setFontSize(SIZE_BODY)
  doc.setLineHeightFactor(LINE_SPACING)
  doc.setTextColor(...INK)
}

const applyTitle = (doc: jsPDF) => {
  doc.setFont(FONT, "bold")
  doc.setFontSize(SIZE_TITLE)
  doc.setLineHeightFactor(LINE_SPACING)
  doc.setTextColor(...INK)
}

const loadLogoPng = async (): Promise<string> => {
  const size = 256
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext("2d")
      if (!context) {
        reject(new Error("No se pudo preparar el logo."))
        return
      }
      context.drawImage(image, 0, 0, size, size)
      resolve(canvas.toDataURL("image/png"))
    }
    image.onerror = () => {
      reject(new Error("No se pudo cargar el logo."))
    }
    image.src = COMPANY_LOGO_SRC
  })
}

const fileStamp = (isoDate: string) => {
  const date = isoDate.length > 0 ? new Date(isoDate) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

const slug = (value: string) => {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+/g, "-")
    .replace(/^-|-$/g, "")
  if (cleaned.length === 0) {
    return "informe"
  }
  return cleaned
}

const createDocument = () => {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  doc.setLineHeightFactor(LINE_SPACING)
  applyBody(doc)
  return doc
}

const drawHeader = (
  doc: jsPDF,
  logo: string,
  title: string,
  issued: string
) => {
  const width = doc.internal.pageSize.getWidth()
  doc.addImage(logo, "PNG", MARGIN_X, MARGIN_TOP, 12, 12)
  applyTitle(doc)
  doc.text(COMPANY.name, MARGIN_X + 16, MARGIN_TOP + 5)
  applyBody(doc)
  doc.setTextColor(...MUTED)
  doc.text(
    COMPANY.product,
    MARGIN_X + 16,
    MARGIN_TOP + 5 + lineHeightMm(SIZE_BODY)
  )
  doc.setTextColor(...INK)
  const headerBottom = MARGIN_TOP + 16
  doc.setDrawColor(...LINE)
  doc.setLineWidth(0.3)
  doc.line(MARGIN_X, headerBottom, width - MARGIN_X, headerBottom)
  applyTitle(doc)
  doc.text(title, MARGIN_X, headerBottom + lineHeightMm(SIZE_TITLE) + 2)
  applyBody(doc)
  doc.setTextColor(...MUTED)
  doc.text(
    `Fecha: ${issued}`,
    width - MARGIN_X,
    headerBottom + lineHeightMm(SIZE_TITLE) + 2,
    { align: "right" }
  )
  doc.setTextColor(...INK)
  return headerBottom + lineHeightMm(SIZE_TITLE) + lineHeightMm(SIZE_BODY) + 4
}

const drawFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages()
  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    applyBody(doc)
    doc.setTextColor(...MUTED)
    doc.text(COMPANY.name, MARGIN_X, height - MARGIN_BOTTOM + 8)
    doc.text(
      `Página ${page} de ${pageCount}`,
      width - MARGIN_X,
      height - MARGIN_BOTTOM + 8,
      { align: "right" }
    )
    doc.setTextColor(...INK)
  }
}

const sectionTitle = (doc: jsPDF, text: string, y: number) => {
  applyTitle(doc)
  doc.text(text, MARGIN_X, y)
  return y + lineHeightMm(SIZE_TITLE)
}

const tableEndY = (doc: jsPDF, fallback: number) => {
  const withTable = doc as jsPDF & { lastAutoTable: { finalY: number } }
  if (!withTable.lastAutoTable) {
    return fallback
  }
  return withTable.lastAutoTable.finalY
}

const baseTableStyles = {
  font: FONT,
  fontSize: SIZE_BODY,
  textColor: INK,
  lineColor: LINE,
  lineWidth: 0.2,
  cellPadding: {
    top: 1,
    bottom: 1,
    left: 2.5,
    right: 2.5,
  },
  valign: "middle" as const,
  overflow: "linebreak" as const,
}

const kvTable = (doc: jsPDF, startY: number, rows: Array<[string, string]>) => {
  autoTable(doc, {
    startY,
    theme: "plain",
    styles: baseTableStyles,
    columnStyles: {
      0: { cellWidth: 52, fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "normal" },
    },
    body: rows,
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: MARGIN_BOTTOM + 8 },
  })
  applyBody(doc)
  return tableEndY(doc, startY)
}

const dataTable = (
  doc: jsPDF,
  startY: number,
  head: string[],
  body: string[][]
) => {
  autoTable(doc, {
    startY,
    theme: "grid",
    head: [head],
    body,
    styles: baseTableStyles,
    headStyles: {
      fillColor: HEAD_FILL,
      textColor: INK,
      fontStyle: "bold",
      font: FONT,
      fontSize: SIZE_BODY,
      lineColor: LINE,
      lineWidth: 0.2,
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: MARGIN_BOTTOM + 8 },
  })
  applyBody(doc)
  return tableEndY(doc, startY)
}

export const downloadProjectReportPdf = async (snapshot: ReportSnapshot) => {
  const logo = await loadLogoPng()
  const doc = createDocument()
  const issued = formatDate(
    snapshot.createdAt.length > 0
      ? snapshot.createdAt
      : new Date().toISOString()
  )
  const unit = timeUnitLabel(snapshot.timeUnit)
  let y = drawHeader(doc, logo, COMPANY.documentKind, issued)

  y = sectionTitle(doc, "1. Datos del proyecto", y)
  y =
    kvTable(doc, y, [
      [
        "Proyecto",
        snapshot.projectName.length > 0 ? snapshot.projectName : "—",
      ],
      [
        "Tipo",
        snapshot.projectType.length > 0
          ? projectTypeLabel(snapshot.projectType)
          : "—",
      ],
      [
        "Estado",
        snapshot.projectStatus.length > 0
          ? projectStatusLabel(snapshot.projectStatus)
          : "—",
      ],
      [
        "Responsable",
        snapshot.projectOwner.length > 0 ? snapshot.projectOwner : "—",
      ],
    ]) + lineHeightMm(SIZE_BODY)

  y = sectionTitle(doc, "2. Esfuerzo y tiempo", y)
  y =
    dataTable(
      doc,
      y,
      ["Concepto", "Valor"],
      [
        ["Historias de usuario", String(snapshot.storiesTotal)],
        ["Historias con puntos", String(snapshot.storiesWithPoints)],
        ["Puntos de historia", String(snapshot.baseEffortPoints)],
        ["Sprints estimados", String(snapshot.totalSprints)],
        ["Tiempo calendario base", `${snapshot.baseTime} ${unit}`],
        ["Tiempo con contingencia", `${snapshot.totalTime} ${unit}`],
        ["Horas de esfuerzo", `${snapshot.totalEffortHours} h`],
        [
          "Tareas con horas",
          `${snapshot.tasksWithHours} / ${snapshot.tasksTotal}`,
        ],
      ]
    ) + lineHeightMm(SIZE_BODY)

  y = sectionTitle(doc, "3. Costo (soles)", y)
  y =
    dataTable(
      doc,
      y,
      ["Concepto", "Importe"],
      [
        ["Costo base (horas × CER)", formatCurrency(snapshot.baseCost)],
        [
          `Contingencia (${snapshot.contingencyMarginPercentage}%)`,
          formatCurrency(snapshot.contingencyCost),
        ],
        ["Costo total", formatCurrency(snapshot.totalCost)],
      ]
    ) + lineHeightMm(SIZE_BODY)

  y = sectionTitle(doc, "4. Riesgo y contingencia", y)
  kvTable(doc, y, [
    ["Nivel de riesgo", riskLevelLabel(snapshot.riskLevel)],
    ["Margen aplicado", `${snapshot.contingencyMarginPercentage}%`],
    ["Tiempo adicional", `${snapshot.contingencyTime} ${unit}`],
    ["Costo adicional", formatCurrency(snapshot.contingencyCost)],
  ])

  drawFooter(doc)
  const name = slug(snapshot.projectName)
  doc.save(`informe-estimacion-${name}-${fileStamp(snapshot.createdAt)}.pdf`)
}

export const downloadSystemReportPdf = async (report: GlobalSystemReport) => {
  const logo = await loadLogoPng()
  const doc = createDocument()
  const issuedAt = new Date().toISOString()
  const issued = formatDate(issuedAt)
  let y = drawHeader(doc, logo, COMPANY.systemDocumentKind, issued)

  y = sectionTitle(doc, "1. Resumen", y)
  y =
    dataTable(
      doc,
      y,
      ["Indicador", "Valor"],
      [
        ["Proyectos", String(report.totalProjects)],
        ["Con estimación", String(report.totalEstimatesCompleted)],
        ["Puntos de historia", String(report.totalSystemStoryPoints)],
        ["Tiempo base (días)", report.totalSystemBaseTime.toFixed(1)],
        ["Costo base", formatCurrency(report.totalSystemBaseCost)],
        ["Contingencia", formatCurrency(report.totalSystemContingencyCost)],
        ["Costo total", formatCurrency(report.totalSystemCost)],
      ]
    ) + lineHeightMm(SIZE_BODY)

  y = sectionTitle(doc, "2. Detalle por proyecto", y)
  const rows = report.projectSummaries.map((summary) => {
    if (!summary.latestEstimate) {
      return [
        summary.projectName,
        projectStatusLabel(summary.projectStatus),
        "—",
        "—",
        "—",
        "—",
      ]
    }
    const estimate = summary.latestEstimate
    return [
      summary.projectName,
      projectStatusLabel(summary.projectStatus),
      String(estimate.baseEffortPoints),
      `${estimate.baseTime} ${timeUnitLabel(estimate.timeUnit)}`,
      `${riskLevelLabel(estimate.riskLevel)} (${estimate.contingencyMarginPercentage}%)`,
      formatCurrency(estimate.totalCost),
    ]
  })

  dataTable(
    doc,
    y,
    ["Proyecto", "Estado", "Puntos", "Tiempo", "Riesgo", "Costo total"],
    rows
  )
  drawFooter(doc)
  doc.save(`informe-portafolio-intecx-${fileStamp(issuedAt)}.pdf`)
}
