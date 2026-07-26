import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StoreModal } from './components/StoreModal';
import { ToastContainer } from './components/ToastContainer';

// Views
import { FornecedoresView } from './components/views/FornecedoresView';
import { DashboardView } from './components/views/DashboardView';
import { VendasView } from './components/views/VendasView';
import { FinanceiroView } from './components/views/FinanceiroView';
import { CaixasView } from './components/views/CaixasView';
import { RelatoriosView } from './components/views/RelatoriosView';
import { EstoqueView } from './components/views/EstoqueView';
import { ClientesView } from './components/views/ClientesView';
import { FuncionariosView } from './components/views/FuncionariosView';
import { LojasView } from './components/views/LojasView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-100/70">
      {activeView === 'fornecedores' && <FornecedoresView />}
      {activeView === 'dashboard' && <DashboardView />}
      {activeView === 'vendas' && <VendasView />}
      {activeView === 'financeiro' && <FinanceiroView />}
      {activeView === 'caixas' && <CaixasView />}
      {activeView === 'relatorios' && <RelatoriosView />}
      {activeView === 'estoque' && <EstoqueView />}
      {activeView === 'clientes' && <ClientesView />}
      {activeView === 'funcionarios' && <FuncionariosView />}
      {activeView === 'lojas' && <LojasView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Right Main Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <MainContent />
        </div>

        {/* Modals & Toasts */}
        <StoreModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
