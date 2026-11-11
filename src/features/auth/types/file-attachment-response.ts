export type FileAttachmentResponse = {
  id: string
  type: "AVATAR" | "PDF"
  fileName: string
  contentType: string
  sizeBytes: number
  storagePath: string
  createdAt: string
}

export type FileAttachment = FileAttachmentResponse
