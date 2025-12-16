import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__left">
        <div className="auth-layout__nav">
          <div className="brand-logo">
            <span className="brand-logo__icon">store</span>
            <span className="brand-logo__text">CatalogoNet</span>
          </div>
          <a href="#" className="nav-link">← Voltar</a>
        </div>
        
        <div className="auth-layout__form-container">
          {children}
        </div>

        <div className="auth-layout__footer">
          Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>
        </div>
      </div>

      <div className="auth-layout__right">
        <div className="marketing-content">
          <h1 className="marketing-title">Venda mais com seu catálogo digital</h1>
          <p className="marketing-subtitle">
            Gerencie produtos, receba pedidos e acompanhe vendas em um só lugar
          </p>

          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Catálogo profissional em minutos</span>
            </li>
            <li className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Pedidos direto pelo WhatsApp</span>
            </li>
            <li className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Acompanhe todas as suas vendas</span>
            </li>
            <li className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Comece grátis, sem cartão</span>
            </li>
          </ul>

          <div className="social-proof">
            <span className="social-proof__icon">👥</span>
            <span>Mais de <strong>1.000 negócios</strong> vendendo todos os dias</span>
          </div>
        </div>
      </div>
    </div>
  )
}
