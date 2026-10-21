import api from './axios'
import type { AuthResponse, User } from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/login', { email, password }),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api.post<AuthResponse>('/register', { name, email, password, password_confirmation }),

  me: () => api.get<User>('/me'),

  logout: () => api.post('/logout'),
}
