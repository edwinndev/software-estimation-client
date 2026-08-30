export interface Project {
  id: string
  nombre: string
  descripcion: string
  tipo: string
  fecha_inicio: string // ISO string
  fecha_fin: string // ISO string
  responsable: string
  estado: string
  createdAt: string
}
