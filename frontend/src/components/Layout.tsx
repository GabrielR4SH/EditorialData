import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#0a0b0f' }}>
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
