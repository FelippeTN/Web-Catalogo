import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

type Props = {
  onAuthenticated: () => void
}

export default function RegisterPage({ onAuthenticated }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name && email && password) {
      onAuthenticated()
      navigate('/catalogos')
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2 className="auth-title">Crie sua conta</h2>
        <p className="auth-subtitle">Comece a vender mais com seu catálogo digital</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome da loja</label>
          <input
            id="name"
            type="text"
            placeholder="Ex: Minha Loja Incrível"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>

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
          <label htmlFor="password">Senha</label>
          <div className="input-wrapper">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">Criar conta grátis</button>

        <div className="form-footer">
          Já tem uma conta? <Link to="/login" className="link-highlight">Entrar</Link>
        </div>

        <div className="divider">
          <span>ou</span>
        </div>

        <button type="button" className="btn-whatsapp">
          <span className="icon">💬</span> Cadastro com WhatsApp
        </button>
      </form>
    </AuthLayout>
  )
}
