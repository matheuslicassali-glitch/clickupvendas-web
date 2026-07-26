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
  Store,
  ChevronDown,
  Layers,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../contexts/StoreContext'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { path: '/caixas', label: 'Caixas', icon: Wallet },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/funcionarios', label: 'Funcionários', icon: UserCheck },
  { path: '/fornecedores', label: 'Fornecedores', icon: Truck },
  { path: '/lojas', label: 'Lojas', icon: Store },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false)
  const location = useLocation()
  const { lojas, lojaAtiva, selecionar } = useStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStoreDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentPage = menuItems.find((m) => m.path === location.pathname)?.label || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[250px] flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--bg-sidebar)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 h-[64px] px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#3bafda] flex items-center justify-center">
            <Layers size={18} className="text-white" />
          </div>
          <h1 className="text-[15px] font-semibold text-white tracking-tight">ClickUp Vendas</h1>
        </div>

        {/* Store Selector */}
        {lojas.length > 0 && (
          <div className="px-3 py-3 border-b border-white/10 relative" ref={dropdownRef}>
            <button
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <Store size={15} className="text-[#3bafda]" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white truncate">{lojaAtiva?.nome || 'Selecionar loja'}</p>
              </div>
              <ChevronDown size={14} className={`text-[#90a4ae] transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {storeDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#e8eaed] overflow-hidden z-50">
                <div className="p-1">
                  {lojas.map((loja) => (
                    <button
                      key={loja.id}
                      onClick={() => { selecionar(loja.id); setStoreDropdownOpen(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left text-[13px] font-medium transition-colors ${
                        lojaAtiva?.id === loja.id ? 'bg-[#e3f2fd] text-[#1565c0]' : 'text-[#636e72] hover:bg-[#f5f7fa]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span className="truncate">{loja.nome}</span>
                    </button>
                  ))}
                  <div className="border-t border-[#e8eaed] my-1" />
                  <NavLink
                    to="/lojas"
                    onClick={() => setStoreDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded text-[13px] font-medium text-[#3bafda] hover:bg-[#e3f2fd]"
                  >
                    <Store size={14} />
                    Gerenciar Lojas
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#78909c]">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#3bafda] shadow-sm'
                    : 'text-[#b0bec5] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center h-[64px] px-6 lg:px-8 border-b"
          style={{ background: 'var(--bg-header)', borderColor: 'var(--border-color)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 rounded-lg hover:bg-[#f0f2f5] transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <h2 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {currentPage}
          </h2>

          <div className="ml-auto flex items-center gap-3">
            {!lojaAtiva && lojas.length === 0 && (
              <NavLink
                to="/lojas"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-colors"
                style={{ background: 'var(--accent)' }}
              >
                <Store size={14} />
                Configurar Loja
              </NavLink>
            )}
            {lojaAtiva && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#e8f5e9] text-[#2e7d32]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#26a69a]" />
                Sincronizado
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]" style={{ background: '#f5f7fa', color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ background: 'var(--bg-primary)' }}>
          {location.pathname === '/lojas' ? (
            <Outlet />
          ) : (
            <div className="relative h-full">
              <Outlet />
              {!lojaAtiva && lojas.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-[2px] z-10">
                  <div className="bg-white rounded-xl border border-[#e8eaed] shadow-lg p-8 text-center max-w-md w-full">
                    <div className="w-14 h-14 rounded-xl bg-[#e3f2fd] flex items-center justify-center mx-auto mb-4">
                      <Store size={24} className="text-[#1565c0]" />
                    </div>
                    <h3 className="text-[16px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Nenhuma loja configurada</h3>
                    <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>Adicione os dados do Supabase da sua loja para visualizar as vendas e o estoque em tempo real.</p>
                    <NavLink
                      to="/lojas"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-[13px] font-medium transition-colors"
                      style={{ background: 'var(--accent)' }}
                    >
                      <Store size={16} />
                      Configurar Primeira Loja
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
