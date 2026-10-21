import { type ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-lg rounded-2xl p-6 animate-fade-in"
        style={{ background: '#0f1117', border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
