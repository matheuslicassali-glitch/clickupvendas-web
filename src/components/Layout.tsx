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
  Settings,
  Menu,
  X,
  CreditCard,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { path: '/caixas', label: 'Caixas', icon: Wallet },
  { path: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { path: '/relatorios', label: 'Relatorios', icon: BarChart3 },
  { path: '/estoque', label: 'Estoque', icon: Package },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/funcionarios', label: 'Funcionarios', icon: UserCheck },
  { path: '/fornecedores', label: 'Fornecedores', icon: Truck },
  { path: '/fiado', label: 'Fiado', icon: CreditCard },
  { path: '/configuracoes', label: 'Configuracoes', icon: Settings },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <h1 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
            ClickUp Vendas
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: 'var(--muted-foreground)' }}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
                }}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center h-16 px-6"
          style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4"
            style={{ color: 'var(--foreground)' }}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            {menuItems.find((m) => m.path === location.pathname)?.label || 'ClickUp Vendas'}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
