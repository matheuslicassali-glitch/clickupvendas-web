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
  CreditCard,
  Eye,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-purple-500' },
  { path: '/vendas', label: 'Vendas', icon: ShoppingCart, gradient: 'from-green-500 to-cyan-500' },
  { path: '/financeiro', label: 'Financeiro', icon: DollarSign, gradient: 'from-amber-500 to-orange-500' },
  { path: '/caixas', label: 'Caixas', icon: Wallet, gradient: 'from-purple-500 to-pink-500' },
  { path: '/relatorios', label: 'Relatorios', icon: BarChart3, gradient: 'from-cyan-500 to-blue-500' },
  { path: '/estoque', label: 'Estoque', icon: Package, gradient: 'from-emerald-500 to-teal-500' },
  { path: '/clientes', label: 'Clientes', icon: Users, gradient: 'from-pink-500 to-rose-500' },
  { path: '/funcionarios', label: 'Funcionarios', icon: UserCheck, gradient: 'from-violet-500 to-indigo-500' },
  { path: '/fornecedores', label: 'Fornecedores', icon: Truck, gradient: 'from-orange-500 to-amber-500' },
  { path: '/fiado', label: 'Fiado', icon: CreditCard, gradient: 'from-red-500 to-pink-500' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transform transition-all duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-3 h-[72px] px-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-blue)' }}>
            <Eye size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-white tracking-tight">ClickUp Vendas</h1>
            <p className="text-[11px] text-slate-500 font-medium">Painel Gerencial</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 animate-slide-in"
                style={{
                  animationDelay: `${index * 30}ms`,
                  background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <Icon size={16} />
                </div>
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--gradient-purple)', color: 'white' }}>
              CU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-300 truncate">ClickUp</p>
              <p className="text-[11px] text-slate-500">Apenas visualizacao</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center h-[72px] px-6"
          style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 rounded-xl hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {menuItems.find((m) => m.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Online</span>
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
