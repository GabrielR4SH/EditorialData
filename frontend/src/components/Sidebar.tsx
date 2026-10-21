import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/sectors', icon: '◈', label: 'Setores' },
  { to: '/researches', icon: '◎', label: 'Pesquisas' },
  { to: '/publications', icon: '◉', label: 'Publicações' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-40"
      style={{ background: 'linear-gradient(180deg, #0f1117 0%, #0a0b0f 100%)', borderRight: '1px solid rgba(139,92,246,0.15)' }}>

      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            ED
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              EditorialData
            </p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Análise Editorial</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-4">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-widest" style={{ color: '#4b5563' }}>
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.1))',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa'
            } : {}}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 pb-6 border-t" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
        <div className="pt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: '#6b7280' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Sair"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
            ⎋
          </button>
        </div>
      </div>
    </aside>
  )
}
