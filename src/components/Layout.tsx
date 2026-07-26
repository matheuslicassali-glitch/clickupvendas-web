import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Store,
  UserCheck,
  Building2,
  Layers,
  ChevronDown,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../contexts/StoreContext'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { path: '/caixas', label: 'Caixas', icon: Receipt },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/funcionarios', label: 'Funcionários', icon: UserCheck },
  { path: '/fornecedores', label: 'Fornecedores', icon: Store },
  { path: '/lojas', label: 'Lojas', icon: Building2 },
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

  const formatDate = () => {
    const today = new Date()
    const days = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.']
    const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
    return `${days[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]}`
  }

  const showEmptyState = !lojaAtiva && lojas.length === 0 && location.pathname !== '/lojas'

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1c2838] text-slate-300 flex flex-col shrink-0 min-h-screen select-none transition-transform duration-200 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-700/50">
          <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">ClickUp Vendas</span>
        </div>

        {/* Store Selector */}
        {lojas.length > 0 && (
          <div className="px-3 py-3 border-b border-slate-700/50 relative" ref={dropdownRef}>
            <button
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <Store size={15} className="text-sky-400" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white truncate">{lojaAtiva?.nome || 'Selecionar loja'}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {storeDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                <div className="p-1">
                  {lojas.map((loja) => (
                    <button
                      key={loja.id}
                      onClick={() => { selecionar(loja.id); setStoreDropdownOpen(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left text-xs font-medium transition-colors ${
                        lojaAtiva?.id === loja.id ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span className="truncate">{loja.nome}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1" />
                  <NavLink
                    to="/lojas"
                    onClick={() => setStoreDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded text-xs font-medium text-sky-500 hover:bg-sky-50"
                  >
                    <Store size={14} />
                    Gerenciar Lojas
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2a3c54] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#233246]'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 flex items-center justify-between">
          <span>v2.4.0 • Online</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          {/* Title & Date */}
          <div className="flex items-baseline gap-4">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {currentPage}
            </h1>
            <span className="text-sm font-medium text-slate-500">
              {formatDate()}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Store Selector */}
            {lojas.length > 0 && (
              <select
                value={lojaAtiva?.id || ''}
                onChange={(e) => selecionar(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>{loja.nome}</option>
                ))}
              </select>
            )}

            {/* Configurar Loja Button */}
            {showEmptyState && (
              <NavLink
                to="/lojas"
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-2xs"
              >
                <Store className="w-4 h-4 text-slate-500" />
                <span>Configurar Loja</span>
              </NavLink>
            )}

            {/* Sync Status */}
            {lojaAtiva && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sincronizado
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70">
          {showEmptyState ? (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, marginLeft: 0, marginTop: 0 }}>
              <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
                  <Store className="w-10 h-10 text-sky-500" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-800 mb-2">Nenhuma loja configurada</h2>

                {/* Subtitle */}
                <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-xs">
                  Adicione os dados do Supabase da sua loja para visualizar as vendas e o estoque em tempo real.
                </p>

                {/* CTA Button */}
                <NavLink
                  to="/lojas"
                  className="w-full py-3 bg-[#38a9e4] hover:bg-[#2b96d1] text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20"
                >
                  <Store className="w-5 h-5" />
                  <span>Configurar Primeira Loja</span>
                </NavLink>
              </div>
            </div>
          ) : location.pathname === '/lojas' ? (
            <Outlet />
          ) : (
            <div className="p-6 max-w-7xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
