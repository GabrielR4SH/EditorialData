interface BadgeProps {
  value: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const variants: Record<string, { bg: string; color: string }> = {
  default: { bg: 'rgba(107,114,128,0.2)', color: '#9ca3af' },
  success: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  warning: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
  danger: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  info: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
}

export function Badge({ value, variant = 'default' }: BadgeProps) {
  const { bg, color } = variants[variant] ?? variants.default
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color }}>
      {value}
    </span>
  )
}

export function statusVariant(status: string): BadgeProps['variant'] {
  if (status === 'published' || status === 'completed') return 'success'
  if (status === 'in_progress') return 'info'
  if (status === 'archived') return 'danger'
  return 'warning'
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: 'Rascunho',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    archived: 'Arquivado',
    published: 'Publicado',
  }
  return map[status] ?? status
}

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    yearbook: 'Anuário',
    special_edition: 'Edição Especial',
    report: 'Relatório',
    bulletin: 'Boletim',
  }
  return map[type] ?? type
}
