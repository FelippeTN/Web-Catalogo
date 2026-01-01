import { Button } from '@/components/ui'
import { Store, LogOut, ChevronLeft, User } from 'lucide-react'
import { motion } from 'framer-motion'

export interface HeaderProps {
  title: string
  subtitle?: string
  showLogo?: boolean
  backLabel?: string
  onBack?: () => void
  onLogout?: () => void
}

export function Header({
  title,
  subtitle,
  showLogo = true,
  backLabel,
  onBack,
  onLogout,
}: HeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="group -ml-2 text-gray-500 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-0.5" />
                <span className="font-medium text-sm">{backLabel || 'Voltar'}</span>
              </Button>
              <div className="hidden sm:block h-6 w-px bg-gray-200 mx-3" />
            </div>
          )}

          <div className="flex items-center gap-3">
            {showLogo && (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
                <Store className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="flex flex-col justify-center">
              <h1 className="text-sm font-semibold text-gray-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {onLogout && (
          <div className="flex items-center gap-3 pl-6 sm:border-l sm:border-gray-100">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-medium text-gray-700">Minha Conta</span>
                <span className="text-[10px] text-gray-400">Gerenciar</span>
             </div>
             <div className="hidden sm:flex w-8 h-8 bg-gray-100 rounded-full items-center justify-center border border-gray-200">
                <User className="w-4 h-4 text-gray-500" />
             </div>
             <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 ml-1"
              title="Sair"
             >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  )
}
