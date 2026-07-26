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
  Store,
  ChevronDown,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../contexts/StoreContext'

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
  { path: '/lojas', label: 'Lojas', icon: Store },
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
  '/lojas': 'linear-gradient(135deg, #667eea, #764ba2)',
}

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

        {/* Store Selector in Sidebar */}
        {lojas.length > 0 && (
          <div className="px-4 py-3 relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div ref={dropdownRef}>
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(102, 126, 234, 0.08)',
                  border: '1px solid rgba(102, 126, 234, 0.15)',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  <Store size={14} className="text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[12px] font-bold truncate" style={{ color: '#f1f5f9' }}>
                    {lojaAtiva?.nome || 'Nenhuma loja'}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: '#475569' }}>
                    {lojaAtiva ? lojaAtiva.supabaseUrl.replace('https://', '').split('.')[0] : 'Configure em Lojas'}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    color: '#64748b',
                    transform: storeDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              {storeDropdownOpen && (
                <div
                  className="absolute left-4 right-4 top-full mt-1 rounded-xl overflow-hidden z-50"
                  style={{
                    background: '#0d1220',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    animation: 'fadeIn 0.15s ease-out',
                  }}
                >
                  {lojas.map((loja) => (
                    <button
                      key={loja.id}
                      onClick={() => { selecionar(loja.id); setStoreDropdownOpen(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150"
                      style={{
                        background: lojaAtiva?.id === loja.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                      onMouseEnter={(e) => { if (lojaAtiva?.id !== loja.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={(e) => { if (lojaAtiva?.id !== loja.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: lojaAtiva?.id === loja.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.05)',
                          color: lojaAtiva?.id === loja.id ? 'white' : '#64748b',
                        }}
                      >
                        {loja.nome.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate" style={{ color: lojaAtiva?.id === loja.id ? '#f1f5f9' : '#94a3b8' }}>
                          {loja.nome}
                        </p>
                      </div>
                      {lojaAtiva?.id === loja.id && (
                        <div className="w-2 h-2 rounded-full" style={{ background: '#38ef7d', boxShadow: '0 0 6px #38ef7d' }} />
                      )}
                    </button>
                  ))}
                  <NavLink
                    to="/lojas"
                    onClick={() => setStoreDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150"
                    style={{ color: '#667eea' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(102, 126, 234, 0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                      <Store size={12} style={{ color: '#667eea' }} />
                    </div>
                    <span className="text-[12px] font-semibold">Gerenciar Lojas</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}

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
            {!lojaAtiva && lojas.length === 0 && (
              <NavLink
                to="/lojas"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.2)' }}
              >
                <Store size={14} />
                Configurar Loja
              </NavLink>
            )}
            {lojaAtiva && (
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl" style={{ background: 'rgba(56, 239, 125, 0.06)', border: '1px solid rgba(56, 239, 125, 0.15)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#38ef7d', boxShadow: '0 0 8px #38ef7d', animation: 'pulse-glow 2s infinite' }} />
                <span className="text-[12px] font-semibold" style={{ color: '#38ef7d' }}>Online</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[12px] font-medium" style={{ color: '#94a3b8' }}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ background: 'var(--bg-primary)' }}>
          {!lojaAtiva && lojas.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                  <Store size={36} style={{ color: '#667eea' }} />
                </div>
                <p className="text-[18px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Bem-vindo ao Painel Gerencial</p>
                <p className="text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>Adicione sua primeira loja para comecar</p>
                <NavLink
                  to="/lojas"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}
                >
                  <Store size={18} />
                  Configurar Loja
                </NavLink>
              </div>
            </div>
          ) : !lojaAtiva ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[16px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Selecione uma loja</p>
                <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>Use o seletor no menu lateral</p>
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
