import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { sectorsApi } from '../api/sectors'
import { researchesApi } from '../api/researches'
import { publicationsApi } from '../api/publications'
import type { Research, Publication } from '../types'
import { Badge, statusVariant, statusLabel } from '../components/Badge'
import { Link } from 'react-router-dom'

interface Stats {
  sectors: number
  researches: number
  publications: number
  activeSectors: number
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="rounded-2xl p-6 transition-transform hover:scale-[1.02]"
      style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: '#6b7280' }}>{label}</p>
          <p className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: color + '18', border: `1px solid ${color}30` }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ sectors: 0, researches: 0, publications: 0, activeSectors: 0 })
  const [recentResearches, setRecentResearches] = useState<Research[]>([])
  const [recentPublications, setRecentPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      sectorsApi.list(),
      researchesApi.list(),
      publicationsApi.list(),
    ]).then(([sRes, rRes, pRes]) => {
      const sectors = sRes.data
      const researches = rRes.data
      const publications = pRes.data
      setStats({
        sectors: sectors.length,
        activeSectors: sectors.filter(s => s.is_active).length,
        researches: researches.length,
        publications: publications.length,
      })
      setRecentResearches(researches.slice(0, 5))
      setRecentPublications(publications.slice(0, 5))
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
          Aqui está um resumo do EditorialData
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Setores" value={stats.sectors} icon="◈" color="#8b5cf6" />
          <StatCard label="Setores Ativos" value={stats.activeSectors} icon="✦" color="#22c55e" />
          <StatCard label="Pesquisas" value={stats.researches} icon="◎" color="#3b82f6" />
          <StatCard label="Publicações" value={stats.publications} icon="◉" color="#f59e0b" />
        </div>
      )}

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesquisas recentes */}
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Pesquisas Recentes
            </h2>
            <Link to="/researches" className="text-xs font-medium transition-colors" style={{ color: '#a78bfa' }}>
              Ver todas →
            </Link>
          </div>
          {recentResearches.length === 0 ? (
            <div className="py-8 text-center" style={{ color: '#4b5563' }}>
              <p className="text-3xl mb-2">◎</p>
              <p className="text-sm">Nenhuma pesquisa cadastrada</p>
              <Link to="/researches" className="text-xs mt-2 inline-block" style={{ color: '#8b5cf6' }}>Adicionar pesquisa →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResearches.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-b-0"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{r.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{r.sector?.name ?? '—'}</p>
                  </div>
                  <Badge value={statusLabel(r.status)} variant={statusVariant(r.status)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publicações recentes */}
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Publicações Recentes
            </h2>
            <Link to="/publications" className="text-xs font-medium" style={{ color: '#a78bfa' }}>
              Ver todas →
            </Link>
          </div>
          {recentPublications.length === 0 ? (
            <div className="py-8 text-center" style={{ color: '#4b5563' }}>
              <p className="text-3xl mb-2">◉</p>
              <p className="text-sm">Nenhuma publicação cadastrada</p>
              <Link to="/publications" className="text-xs mt-2 inline-block" style={{ color: '#8b5cf6' }}>Adicionar publicação →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPublications.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-b-0"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{p.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{p.sector?.name ?? '—'} · {p.year ?? '—'}</p>
                  </div>
                  <Badge value={statusLabel(p.status)} variant={statusVariant(p.status)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
