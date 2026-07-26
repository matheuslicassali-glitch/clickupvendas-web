import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  DollarSign,
  Wallet,
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Truck,
  UserCheck,
  Eye,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { path: '/caixas', label: 'Caixas', icon: Wallet },
  { path: '/relatorios', label: 'Relatorios', icon: BarChart3 },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/funcionarios', label: 'Funcionarios', icon: UserCheck },
  { path: '/fornecedores', label: 'Fornecedores', icon: Truck },
]

const iconGradients: Record<string, string> = {
  '/': 'linear-gradient(135deg, #667eea, #764ba2)',
  '/vendas': 'linear-gradient(135deg, #11998e, #38ef7d)',
  '/financeiro': 'linear-gradient(135deg, #f7971e, #ffd200)',
  '/caixas': 'linear-gradient(135deg, #ee0979, #ff6a00)',
  '/relatorios': 'linear-gradient(135deg, #4facfe, #00f2fe)',
  '/estoque': 'linear-gradient(135deg, #43e97b, #38f9d7)',
  '/clientes': 'linear-gradient(135deg, #fa709a, #fee140)',
  '/funcionarios': 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  '/fornecedores': 'linear-gradient(135deg, #fccb90, #d57eeb)',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[272px] flex flex-col transform transition-all duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1220 50%, #0f1628 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3.5 h-[80px] px-6 relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
              <Eye size={20} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: '#38ef7d', boxShadow: '0 0 8px #38ef7d' }} />
          </div>
          <div>
            <h1 className="text-[16px] font-extrabold tracking-tight" style={{ background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ClickUp Vendas
            </h1>
            <p className="text-[11px] font-medium" style={{ color: '#475569' }}>Painel Gerencial</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3" style={{ color: '#334155' }}>Menu Principal</p>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const gradient = iconGradients[item.path]
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200"
                style={{
                  animationDelay: `${index * 30}ms`,
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isActive ? '#f1f5f9' : '#64748b',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isActive ? gradient : 'rgba(255,255,255,0.03)',
                    boxShadow: isActive ? `0 4px 12px ${gradient?.match(/#[0-9a-f]+/i)?.[0]}33` : 'none',
                  }}
                >
                  <Icon size={17} style={{ color: isActive ? '#fff' : '#64748b' }} />
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#38ef7d', boxShadow: '0 0 6px #38ef7d' }} />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
              CU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: '#cbd5e1' }}>ClickUp</p>
              <p className="text-[11px]" style={{ color: '#475569' }}>Somente visualizacao</p>
            </div>
            <div className="px-2 py-1 rounded-lg" style={{ background: 'rgba(56, 239, 125, 0.1)' }}>
              <span className="text-[10px] font-bold" style={{ color: '#38ef7d' }}>VIEW</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center h-[80px] px-6 lg:px-8"
          style={{
            background: 'linear-gradient(180deg, #0a0e1a 0%, rgba(10, 14, 26, 0.95) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-2.5 rounded-xl transition-colors"
            style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-bold" style={{ color: '#f1f5f9' }}>
              {menuItems.find((m) => m.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl" style={{ background: 'rgba(56, 239, 125, 0.06)', border: '1px solid rgba(56, 239, 125, 0.15)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#38ef7d', boxShadow: '0 0 8px #38ef7d', animation: 'pulse-glow 2s infinite' }} />
              <span className="text-[12px] font-semibold" style={{ color: '#38ef7d' }}>Online</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[12px] font-medium" style={{ color: '#94a3b8' }}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ background: 'var(--bg-primary)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
