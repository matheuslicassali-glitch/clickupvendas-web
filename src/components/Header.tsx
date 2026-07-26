import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Link, ChevronDown } from 'lucide-react';

const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  vendas: 'Vendas (PDV)',
  financeiro: 'Financeiro',
  caixas: 'Gestão de Caixas',
  relatorios: 'Relatórios & Gráficos',
  estoque: 'Estoque & Produtos',
  clientes: 'Clientes & CRM',
  funcionarios: 'Funcionários',
  fornecedores: 'Fornecedores',
  lojas: 'Gerenciamento de Lojas'
};

export const Header: React.FC = () => {
  const { activeView, activeStore, stores, setActiveStoreId, setIsStoreModalOpen } = useApp();

  // Format today's date like "dom., 26 de jul."
  const getFormattedDate = () => {
    const today = new Date();
    const days = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
    const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
    
    const dayName = days[today.getDay()];
    const dayNum = today.getDate();
    const monthName = months[today.getMonth()];

    return `${dayName}, ${dayNum} de ${monthName}`;
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
      {/* Title & Date */}
      <div className="flex items-baseline gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {viewTitles[activeView] || 'Painel Gerencial'}
        </h1>
        <span className="text-sm font-medium text-slate-500">
          {getFormattedDate()}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active Store Selector */}
        {stores.length > 0 && (
          <div className="relative group">
            <select
              value={activeStore?.id || ''}
              onChange={(e) => setActiveStoreId(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isConnected ? '• (Sincronizado)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Configurar Loja Button 1 */}
        <button
          onClick={() => setIsStoreModalOpen(true)}
          className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-2xs cursor-pointer"
        >
          <Store className="w-4 h-4 text-slate-500" />
          <span>Configurar Loja</span>
        </button>

        {/* Configurar Loja Button 2 / Sync Button */}
        <button
          onClick={() => setIsStoreModalOpen(true)}
          className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-2xs cursor-pointer"
        >
          <Link className="w-4 h-4 text-slate-500" />
          <span>Configurar Loja</span>
        </button>
      </div>
    </header>
  );
};
