import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';

import { DashboardView } from './components/views/DashboardView';
import { VendasView } from './components/views/VendasView';
import { FinanceiroView } from './components/views/FinanceiroView';
import { CaixasView } from './components/views/CaixasView';
import { RelatoriosView } from './components/views/RelatoriosView';
import { EstoqueView } from './components/views/EstoqueView';
import { ClientesView } from './components/views/ClientesView';
import { FuncionariosView } from './components/views/FuncionariosView';
import { FornecedoresView } from './components/views/FornecedoresView';
import { Store, Layers } from 'lucide-react';

const EmptyState: React.FC = () => {
  const { isConfigured, isConnecting, connectSupabase, showToast } = useApp();
  const [showForm, setShowForm] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [key, setKey] = React.useState('');

  if (isConfigured) return null;

  const handleConnect = async () => {
    if (!url || !key) { showToast('Preencha URL e Key', 'error'); return; }
    const ok = await connectSupabase(url, key);
    if (ok) setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
          <Store className="w-10 h-10 text-sky-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Nenhuma loja configurada</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-xs">
          Conecte ao Supabase para visualizar vendas, caixas e estoque em tempo real.
        </p>

        {!showForm ? (
          <div className="w-full space-y-3">
            <button onClick={() => setShowForm(true)}
              className="w-full py-3 bg-[#38a9e4] hover:bg-[#2b96d1] text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer">
              <Store className="w-5 h-5" />
              <span>Conectar ao Supabase</span>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Supabase Project URL</label>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xyz.supabase.co"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Supabase Anon Key</label>
              <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="eyJhbGciOi..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleConnect} disabled={isConnecting}
                className="flex-1 py-2.5 bg-[#38a9e4] hover:bg-[#2b96d1] text-white text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50">
                {isConnecting ? 'Conectando...' : 'Conectar'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl cursor-pointer">
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeView, isConfigured } = useApp();

  if (!isConfigured) {
    return (
      <main className="flex-1 overflow-y-auto bg-slate-100/70 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium">Configure uma loja para começar</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-slate-100/70">
      {activeView === 'dashboard' && <DashboardView />}
      {activeView === 'vendas' && <VendasView />}
      {activeView === 'caixas' && <CaixasView />}
      {activeView === 'financeiro' && <FinanceiroView />}
      {activeView === 'relatorios' && <RelatoriosView />}
      {activeView === 'estoque' && <EstoqueView />}
      {activeView === 'funcionarios' && <FuncionariosView />}
      {activeView === 'clientes' && <ClientesView />}
      {activeView === 'fornecedores' && <FornecedoresView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <MainContent />
        </div>
        <EmptyState />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
