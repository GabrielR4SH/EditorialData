import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal'
import { Badge, statusVariant, statusLabel } from '../components/Badge'
import { researchesApi } from '../api/researches'
import { sectorsApi } from '../api/sectors'
import type { Research, Sector } from '../types'

interface FormData {
  sector_id: string; title: string; description: string
  status: string; start_date: string; end_date: string
}
const emptyForm: FormData = { sector_id: '', title: '', description: '', status: 'draft', start_date: '', end_date: '' }

const statusOptions = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'archived', label: 'Arquivado' },
]

export function ResearchesPage() {
  const [researches, setResearches] = useState<Research[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Research | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const load = (status = filterStatus) => {
    setLoading(true)
    Promise.all([
      researchesApi.list(status ? { status } : undefined),
      sectorsApi.list(),
    ]).then(([r, s]) => {
      setResearches(r.data)
      setSectors(s.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setEditing(null); setError(''); setModal('create') }
  const openEdit = (r: Research) => {
    setForm({
      sector_id: String(r.sector_id),
      title: r.title,
      description: r.description ?? '',
      status: r.status,
      start_date: r.start_date ?? '',
      end_date: r.end_date ?? '',
    })
    setEditing(r); setError(''); setModal('edit')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    const payload = {
      ...form,
      sector_id: Number(form.sector_id),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    }
    try {
      if (modal === 'create') await researchesApi.create(payload)
      else if (editing) await researchesApi.update(editing.id, payload)
      setModal(null); load()
    } catch (err: any) {
      const errs = err?.response?.data?.errors ?? {}
      const first = Object.values(errs)?.[0]
      setError(Array.isArray(first) ? first[0] : err?.response?.data?.message ?? 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmar exclusão?')) return
    setDeletingId(id)
    try { await researchesApi.delete(id); load() }
    catch (err: any) { alert(err?.response?.data?.message ?? 'Erro ao excluir.') }
    finally { setDeletingId(null) }
  }

  const handleFilter = (status: string) => {
    setFilterStatus(status)
    setLoading(true)
    researchesApi.list(status ? { status } : undefined).then(r => setResearches(r.data)).finally(() => setLoading(false))
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none"
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f3f4f6' }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Pesquisas</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Gerencie inventários e pesquisas de dados</p>
        </div>
        <button id="btn-new-research" onClick={openCreate}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 15px rgba(139,92,246,0.35)' }}>
          + Nova Pesquisa
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[{ value: '', label: 'Todas' }, ...statusOptions].map(opt => (
          <button key={opt.value} onClick={() => handleFilter(opt.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={filterStatus === opt.value
              ? { background: 'rgba(139,92,246,0.25)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.4)' }
              : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : researches.length === 0 ? (
        <div className="rounded-2xl flex flex-col items-center justify-center py-20"
          style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-5xl mb-3">◎</p>
          <p className="font-medium text-white">Nenhuma pesquisa encontrada</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
            + Adicionar Pesquisa
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Título', 'Setor', 'Responsável', 'Período', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {researches.map((r, idx) => (
                <tr key={r.id} className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: idx < researches.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white text-sm">{r.title}</p>
                    {r.description && <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: '#6b7280' }}>{r.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#9ca3af' }}>{r.sector?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#9ca3af' }}>{r.user?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-xs" style={{ color: '#6b7280' }}>
                    {r.start_date ? r.start_date : '—'}
                    {r.end_date ? ` → ${r.end_date}` : ''}
                  </td>
                  <td className="px-6 py-4">
                    <Badge value={statusLabel(r.status)} variant={statusVariant(r.status)} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(r)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {deletingId === r.id ? '...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Nova Pesquisa' : 'Editar Pesquisa'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Setor</label>
              <select value={form.sector_id} onChange={e => setForm(f => ({ ...f, sector_id: e.target.value }))} required
                className={inputClass} style={inputStyle}>
                <option value="">Selecione um setor</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Título</label>
              <input id="research-title" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Descrição</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className={`${inputClass} resize-none`} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className={inputClass} style={inputStyle}>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Início</label>
                <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Fim</label>
                <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                  className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  )
}
