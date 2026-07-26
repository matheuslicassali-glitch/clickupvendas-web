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

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-[#fafafa]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-[#0b0b0e] border-r border-[#27272a] transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 h-[70px] px-6 border-b border-[#27272a]">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold tracking-tight text-white">ClickUp Vendas</h1>
            <p className="text-[11px] text-[#71717a]">Painel Gerencial</p>
          </div>
        </div>

        {/* Store Selector */}
        {lojas.length > 0 && (
          <div className="p-3 border-b border-[#27272a] relative" ref={dropdownRef}>
            <button
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition-colors text-left"
            >
              <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-semibold">
                <Store size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate text-white">{lojaAtiva?.nome || 'Selecionar loja'}</p>
                <p className="text-[10px] text-[#71717a] truncate">Multi-loja ativo</p>
              </div>
              <ChevronDown size={14} className={`text-[#71717a] transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {storeDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1 bg-[#121215] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50">
                <div className="p-1">
                  {lojas.map((loja) => (
                    <button
                      key={loja.id}
                      onClick={() => { selecionar(loja.id); setStoreDropdownOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-[12px] font-medium transition-colors ${
                        lojaAtiva?.id === loja.id ? 'bg-indigo-600/10 text-indigo-400' : 'text-[#a1a1aa] hover:bg-white/[0.03] hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span className="truncate">{loja.nome}</span>
                    </button>
                  ))}
                  <div className="border-t border-[#27272a] my-1" />
                  <NavLink
                    to="/lojas"
                    onClick={() => setStoreDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded text-[12px] font-medium text-indigo-400 hover:bg-indigo-600/10"
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
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#18181b] text-white font-semibold border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:bg-[#18181b]/50 hover:text-white'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-[#71717a]'} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#27272a]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#121215] border border-[#27272a]">
            <div className="w-7 h-7 rounded bg-[#27272a] flex items-center justify-center text-[11px] font-bold text-white">
              CU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate">ClickUp Vendas</p>
              <p className="text-[10px] text-[#71717a]">Modo Leitura</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
        {/* Header */}
        <header className="flex items-center h-[70px] px-6 lg:px-8 bg-[#09090b] border-b border-[#27272a]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 p-2 rounded-lg text-[#a1a1aa] hover:bg-[#18181b]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <h2 className="text-[16px] font-semibold text-white">
            {menuItems.find((m) => m.path === location.pathname)?.label || 'Dashboard'}
          </h2>

          <div className="ml-auto flex items-center gap-3">
            {!lojaAtiva && lojas.length === 0 && (
              <NavLink
                to="/lojas"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-medium transition-colors shadow-sm"
              >
                <Store size={14} />
                Configurar Loja
              </NavLink>
            )}
            {lojaAtiva && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[12px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[#a18cf8] font-medium text-emerald-400">Sincronizado</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] text-[12px] text-[#71717a]">
              <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#09090b]">
          {location.pathname === '/lojas' ? (
            <Outlet />
          ) : !lojaAtiva && lojas.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="max-w-md w-full bg-[#121215] border border-[#27272a] rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  <Store size={22} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Nenhuma loja configurada</h3>
                <p className="text-[13px] text-[#71717a] mb-6">Adicione os dados do Supabase da sua loja para visualizar as vendas e o estoque em tempo real.</p>
                <NavLink
                  to="/lojas"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium transition-colors shadow-sm"
                >
                  <Store size={16} />
                  Configurar Primeira Loja
                </NavLink>
              </div>
            </div>
          ) : !lojaAtiva ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-sm font-medium text-white mb-1">Nenhuma loja selecionada</p>
                <p className="text-xs text-[#71717a]">Selecione uma loja no menu lateral para visualizar os dados.</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
