import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { SectorsPage } from './pages/SectorsPage'
import { ResearchesPage } from './pages/ResearchesPage'
import { PublicationsPage } from './pages/PublicationsPage'
import { type ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0b0f' }}>
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center text-white font-bold mb-4"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', animation: 'pulse-glow 2s infinite' }}>
            ED
          </div>
          <p className="text-sm" style={{ color: '#6b7280' }}>Carregando...</p>
        </div>
      </div>
    )
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/sectors" element={<ProtectedRoute><SectorsPage /></ProtectedRoute>} />
      <Route path="/researches" element={<ProtectedRoute><ResearchesPage /></ProtectedRoute>} />
      <Route path="/publications" element={<ProtectedRoute><PublicationsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
