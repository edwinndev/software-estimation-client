export type FileAttachment = {
  id: string
  type: "AVATAR" | "PDF"
  fileName: string
  contentType: string
  sizeBytes: number
  storagePath: string
  createdAt: string
}
