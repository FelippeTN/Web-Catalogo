import { useNavigate } from 'react-router-dom';
import { Shield, BarChart3, Sparkles, Layout, Zap, Users } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Layout,
      title: 'Catálogos Profissionais',
      description: 'Crie catálogos elegantes e personalizados para seus produtos'
    },
    {
      icon: Zap,
      title: 'Rápido e Intuitivo',
      description: 'Interface moderna e fácil de usar para gestão ágil'
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Proteção de dados com criptografia de ponta'
    },
    {
      icon: BarChart3,
      title: 'Análise em Tempo Real',
      description: 'Acompanhe o desempenho do seu catálogo'
    },
    {
      icon: Sparkles,
      title: 'Design Moderno',
      description: 'Templates responsivos e profissionais'
    },
    {
      icon: Users,
      title: 'Compartilhamento Fácil',
      description: 'Envie seus catálogos para clientes em segundos'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Catálogo<span className="text-orange-500">Web</span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#solucoes" className="text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors">Soluções</a>
              <a href="#recursos" className="text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors">Recursos</a>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors px-4 py-2"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors px-5 py-2.5 rounded-lg shadow-lg shadow-orange-500/20"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        {/* Hero with gradient background */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-60 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-300">Plataforma #1 em catálogos digitais</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                Sua vitrine digital{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  profissional
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                Plataforma completa para criar, gerenciar e compartilhar catálogos de produtos com excelência e praticidade.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/registro')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl shadow-orange-500/25 transform hover:scale-[1.02]"
                >
                  Começar gratuitamente
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:border-orange-500/50 hover:bg-slate-700 transition-all"
                >
                  Acessar minha conta
                </button>
              </div>

              {/* Stats inline */}
              <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-slate-800">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-slate-500">Empresas ativas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-sm text-slate-500">Catálogos criados</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">99.9%</p>
                  <p className="text-sm text-slate-500">Uptime garantido</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="solucoes" className="py-20 lg:py-28 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-3">Nossas Soluções</h3>
              <p className="text-3xl sm:text-4xl font-bold text-white">
                Tudo que você precisa para{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  vender mais
                </span>
              </p>
            </div>

            <div id="recursos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title} 
                    className="group p-8 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-700/50 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 flex items-center justify-center mb-5 transition-all duration-300">
                      <Icon className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700 p-12 lg:p-16">
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative text-center max-w-2xl mx-auto">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Pronto para começar?
                </h3>
                <p className="text-lg text-slate-400 mb-8">
                  Crie sua conta gratuita e comece a apresentar seus produtos de forma profissional hoje mesmo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/registro')}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl shadow-orange-500/20 transform hover:scale-[1.02]"
                  >
                    Criar conta grátis
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-slate-700/50 text-white font-semibold rounded-xl border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all"
                  >
                    Já tenho conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-bold text-white">
                Catálogo<span className="text-orange-500">Web</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Contato</a>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 CatálogoWeb. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
