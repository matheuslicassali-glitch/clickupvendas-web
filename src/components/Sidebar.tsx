import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Receipt,
  BarChart3,
  Package,
  Users,
  UserCheck,
  Store,
  Building2,
  Layers
} from 'lucide-react';

interface MenuItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'caixas', label: 'Caixas', icon: Receipt },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'funcionarios', label: 'Funcionários', icon: UserCheck },
  { id: 'fornecedores', label: 'Fornecedores', icon: Store },
  { id: 'lojas', label: 'Lojas', icon: Building2 }
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  return (
    <aside className="w-64 bg-[#1c2838] text-slate-300 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-700/50">
        <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">
          ClickUp Vendas
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#2a3c54] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#233246]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 flex items-center justify-between">
        <span>v2.4.0 • Online</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </aside>
  );
};
