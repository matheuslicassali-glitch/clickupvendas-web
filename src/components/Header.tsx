import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Link, ChevronDown, LogOut } from 'lucide-react';

const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  vendas: 'Vendas',
  financeiro: 'Financeiro',
  caixas: 'Caixas',
  relatorios: 'Relatórios & Gráficos',
  estoque: 'Estoque & Produtos',
  clientes: 'Clientes',
  funcionarios: 'Funcionários',
  fornecedores: 'Fornecedores',
};

export const Header: React.FC = () => {
  const { activeView, isConfigured, isConnecting, connectSupabase, disconnectSupabase, showToast } = useApp();
  const [showConfig, setShowConfig] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [key, setKey] = React.useState('');

  const getFormattedDate = () => {
    const today = new Date();
    const days = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
    const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
    return `${days[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]}`;
  };

  const handleConnect = async () => {
    if (!url || !key) { showToast('Preencha URL e Key', 'error'); return; }
    const ok = await connectSupabase(url, key);
    if (ok) setShowConfig(false);
  };

  if (showConfig) {
    return (
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3 flex-1">
          <Store className="w-5 h-5 text-sky-500" />
          <span className="text-sm font-bold text-slate-800">Configurar Conexão Supabase</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xxx.supabase.co"
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="anon key..."
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <button onClick={handleConnect} disabled={isConnecting}
            className="flex items-center gap-1.5 bg-[#38a9e4] hover:bg-[#2b96d1] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-50">
            {isConnecting ? 'Conectando...' : 'Conectar'}
          </button>
          <button onClick={() => setShowConfig(false)} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer">Cancelar</button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
      <div className="flex items-baseline gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {viewTitles[activeView] || 'Painel Gerencial'}
        </h1>
        <span className="text-sm font-medium text-slate-500">{getFormattedDate()}</span>
      </div>

      <div className="flex items-center gap-3">
        {isConfigured ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Conectado
            </div>
            <button onClick={() => setShowConfig(true)}
              className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-2xs cursor-pointer">
              <Link className="w-4 h-4 text-slate-500" />
              <span>Reconfigurar</span>
            </button>
          </>
        ) : (
          <button onClick={() => setShowConfig(true)}
            className="flex items-center gap-2 bg-[#38a9e4] hover:bg-[#2b96d1] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-sky-500/20 cursor-pointer">
            <Store className="w-4 h-4" />
            <span>Conectar Loja</span>
          </button>
        )}
      </div>
    </header>
  );
};
