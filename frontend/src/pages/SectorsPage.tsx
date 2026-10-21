import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal'
import { Badge } from '../components/Badge'
import { sectorsApi } from '../api/sectors'
import type { Sector } from '../types'

interface FormData { name: string; slug: string; description: string; is_active: boolean }
const emptyForm: FormData = { name: '', slug: '', description: '', is_active: true }

function slugify(v: string) {
  return v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Sector | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    sectorsApi.list().then(r => setSectors(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setEditing(null); setError(''); setModal('create') }
  const openEdit = (s: Sector) => {
    setForm({ name: s.name, slug: s.slug, description: s.description ?? '', is_active: s.is_active })
    setEditing(s); setError(''); setModal('edit')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (modal === 'create') await sectorsApi.create(form)
      else if (editing) await sectorsApi.update(editing.id, form)
      setModal(null); load()
    } catch (err: any) {
      const errs = err?.response?.data?.errors ?? {}
      const first = Object.values(errs)?.[0]
      setError(Array.isArray(first) ? first[0] : err?.response?.data?.message ?? 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmar exclusão do setor?')) return
    setDeletingId(id)
    try { await sectorsApi.delete(id); load() }
    catch (err: any) { alert(err?.response?.data?.message ?? 'Erro ao excluir.') }
    finally { setDeletingId(null) }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Setores Econômicos</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Gerencie os setores de atuação editorial</p>
        </div>
        <button id="btn-new-sector" onClick={openCreate}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 15px rgba(139,92,246,0.35)' }}>
          + Novo Setor
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : sectors.length === 0 ? (
        <div className="rounded-2xl flex flex-col items-center justify-center py-20"
          style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-5xl mb-3">◈</p>
          <p className="font-medium text-white mb-1">Nenhum setor cadastrado</p>
          <p className="text-sm mb-4" style={{ color: '#6b7280' }}>Crie o primeiro setor econômico</p>
          <button onClick={openCreate} className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
            + Criar Setor
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(15,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Setor</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Slug</th>
                <th className="text-center px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Pesquisas</th>
                <th className="text-center px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Publicações</th>
                <th className="text-center px-6 py-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {sectors.map((s, idx) => (
                <tr key={s.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: idx < sectors.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white text-sm">{s.name}</p>
                    {s.description && <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: '#6b7280' }}>{s.description}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>{s.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-white font-medium">{s.researches_count ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-white font-medium">{s.publications_count ?? 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge value={s.is_active ? 'Ativo' : 'Inativo'} variant={s.is_active ? 'success' : 'danger'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {deletingId === s.id ? '...' : 'Excluir'}
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
        <Modal title={modal === 'create' ? 'Novo Setor' : 'Editar Setor'} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}
            {[
              { id: 'sector-name', label: 'Nome', value: form.name, onChange: (v: string) => setForm(f => ({ ...f, name: v, slug: slugify(v) })) },
              { id: 'sector-slug', label: 'Slug', value: form.slug, onChange: (v: string) => setForm(f => ({ ...f, slug: v })) },
            ].map(({ id, label, value, onChange }) => (
              <div key={id}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>{label}</label>
                <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f3f4f6' }} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#9ca3af' }}>Descrição</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f3f4f6' }} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="w-4 h-4 rounded accent-violet-500" />
              <span className="text-sm" style={{ color: '#9ca3af' }}>Setor ativo</span>
            </label>
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
