import api from './axios'
import type { Research } from '../types'

export const researchesApi = {
  list: (params?: { sector_id?: number; status?: string }) =>
    api.get<Research[]>('/researches', { params }),
  get: (id: number) => api.get<Research>(`/researches/${id}`),
  create: (data: Partial<Research>) => api.post<Research>('/researches', data),
  update: (id: number, data: Partial<Research>) => api.put<Research>(`/researches/${id}`, data),
  delete: (id: number) => api.delete(`/researches/${id}`),
}
