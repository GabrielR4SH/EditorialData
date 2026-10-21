import api from './axios'
import type { Sector } from '../types'

export const sectorsApi = {
  list: () => api.get<Sector[]>('/sectors'),
  get: (id: number) => api.get<Sector>(`/sectors/${id}`),
  create: (data: Partial<Sector>) => api.post<Sector>('/sectors', data),
  update: (id: number, data: Partial<Sector>) => api.put<Sector>(`/sectors/${id}`, data),
  delete: (id: number) => api.delete(`/sectors/${id}`),
}
