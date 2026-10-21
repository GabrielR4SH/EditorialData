import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/dashboard')
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors ?? {}
      const formatted: Record<string, string> = {}
      for (const key of Object.keys(apiErrors)) {
        formatted[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key]
      }
      if (!Object.keys(formatted).length) {
        formatted['_'] = err?.response?.data?.message ?? 'Erro ao criar conta.'
      }
      setErrors(formatted)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f3f4f6',
  }

  const Field = ({ id, label, type, value, onChange, error }: {
    id: string; label: string; type: string; value: string;
    onChange: (v: string) => void; error?: string
  }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>{label}</label>
      <input
        id={id} type={type} value={value} required
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={e => { e.target.style.border = '1px solid rgba(139,92,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)' }}
        onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(139,92,246,0.15) 0%, #0a0b0f 70%)' }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center text-white font-bold text-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>ED</div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Criar conta</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Junte-se ao EditorialData</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(15,17,23,0.9)', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors['_'] && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {errors['_']}
              </div>
            )}
            <Field id="name" label="Nome" type="text" value={name} onChange={setName} error={errors.name} />
            <Field id="reg-email" label="E-mail" type="email" value={email} onChange={setEmail} error={errors.email} />
            <Field id="reg-password" label="Senha" type="password" value={password} onChange={setPassword} error={errors.password} />
            <Field id="password_confirmation" label="Confirmar senha" type="password" value={passwordConfirmation} onChange={setPasswordConfirmation} />

            <button id="btn-register" type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 15px rgba(139,92,246,0.35)' }}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#6b7280' }}>
            Já tem conta?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#a78bfa' }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
