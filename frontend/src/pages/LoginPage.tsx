import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

type Props = {
  onAuthenticated: () => void
}

export default function LoginPage({ onAuthenticated }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) {
      onAuthenticated()
      navigate('/catalogos')
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2 className="auth-title">Bem-vindo de volta</h2>
        <p className="auth-subtitle">Entre para gerenciar seus catálogos</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="password">Senha</label>
            <a href="#" className="forgot-link">Esqueceu sua senha?</a>
          </div>
          <div className="input-wrapper">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <button type="button" className="toggle-password" aria-label="Mostrar senha">
              👁️
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary">Entrar</button>

        <div className="form-footer">
          Não tem uma conta? <Link to="/registro" className="link-highlight">Cadastre-se</Link>
        </div>

        <div className="divider">
          <span>ou</span>
        </div>

        <button type="button" className="btn-whatsapp">
          <span className="icon">💬</span> Entrar com WhatsApp
        </button>
      </form>
    </AuthLayout>
  )
}
