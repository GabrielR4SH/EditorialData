import api from './axios'
import type { Publication } from '../types'

export const publicationsApi = {
  list: (params?: { sector_id?: number; status?: string; type?: string }) =>
    api.get<Publication[]>('/publications', { params }),
  get: (id: number) => api.get<Publication>(`/publications/${id}`),
  create: (data: Partial<Publication>) => api.post<Publication>('/publications', data),
  update: (id: number, data: Partial<Publication>) => api.put<Publication>(`/publications/${id}`, data),
  delete: (id: number) => api.delete(`/publications/${id}`),
}
