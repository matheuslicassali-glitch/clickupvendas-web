import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ViewType,
  PeriodoFiltro,
  Venda,
  CaixaSessao,
  CaixaMovimentacao,
  Produto,
  Funcionario,
  Cliente,
  Fornecedor,
  FinanceiroConta
} from '../types';
import { getSupabase, isSupabaseConfigured, setSupabaseConfig } from '../lib/supabase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  periodo: PeriodoFiltro;
  setPeriodo: (p: PeriodoFiltro) => void;
  isConfigured: boolean;
  isConnecting: boolean;
  connectSupabase: (url: string, key: string) => Promise<boolean>;
  disconnectSupabase: () => void;

  vendas: Venda[];
  caixas: CaixaSessao[];
  movimentacoes: CaixaMovimentacao[];
  produtos: Produto[];
  funcionarios: Funcionario[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  financeiro: FinanceiroConta[];

  loading: boolean;
  refresh: () => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getDateRange(periodo: PeriodoFiltro): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString();
  let start: string;

  if (periodo === 'hoje') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    start = today.toISOString();
  } else if (periodo === 'semana') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.getFullYear(), now.getMonth(), diff);
    start = monday.toISOString();
  } else {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    start = firstDay.toISOString();
  }

  return { start, end };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('hoje');
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [caixas, setCaixas] = useState<CaixaSessao[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<CaixaMovimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [financeiro, setFinanceiro] = useState<FinanceiroConta[]>([]);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const connectSupabase = async (url: string, key: string): Promise<boolean> => {
    setIsConnecting(true);
    try {
      setSupabaseConfig(url, key);
      const sb = getSupabase();
      if (!sb) return false;
      const { error } = await sb.from('vendas').select('id').limit(1);
      if (error) throw error;
      setIsConfigured(true);
      showToast('Conectado ao Supabase com sucesso!');
      return true;
    } catch {
      showToast('Falha na conexão. Verifique URL e Key.', 'error');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectSupabase = () => {
    localStorage.removeItem('clickup_supabase_url');
    localStorage.removeItem('clickup_supabase_key');
    setIsConfigured(false);
    setVendas([]);
    setCaixas([]);
    setMovimentacoes([]);
    setProdutos([]);
    setFuncionarios([]);
    setClientes([]);
    setFornecedores([]);
    setFinanceiro([]);
  };

  const loadData = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);

    try {
      const { start, end } = getDateRange(periodo);

      const [vendasRes, caixasRes, movRes, prodRes, funcRes, cliRes, fornRes, finRes] = await Promise.all([
        sb.from('vendas').select('*').gte('data', start).lte('data', end).order('data', { ascending: false }),
        sb.from('caixa_sessoes').select('*').order('data_abertura', { ascending: false }),
        sb.from('caixa_movimentacoes').select('*').order('data', { ascending: false }),
        sb.from('produtos').select('*').order('nome'),
        sb.from('funcionarios').select('*').order('nome'),
        sb.from('clientes').select('*').order('nome'),
        sb.from('fornecedores').select('*').order('nome'),
        sb.from('financeiro_contas').select('*').order('data_vencimento', { ascending: false }),
      ]);

      if (vendasRes.data) setVendas(vendasRes.data);
      if (caixasRes.data) setCaixas(caixasRes.data);
      if (movRes.data) setMovimentacoes(movRes.data);
      if (prodRes.data) setProdutos(prodRes.data);
      if (funcRes.data) setFuncionarios(funcRes.data);
      if (cliRes.data) setClientes(cliRes.data);
      if (fornRes.data) setFornecedores(fornRes.data);
      if (finRes.data) setFinanceiro(finRes.data);
    } catch {
      showToast('Erro ao carregar dados do Supabase', 'error');
    } finally {
      setLoading(false);
    }
  }, [periodo, showToast]);

  useEffect(() => {
    if (isConfigured) loadData();
  }, [isConfigured, loadData]);

  return (
    <AppContext.Provider
      value={{
        activeView, setActiveView,
        periodo, setPeriodo,
        isConfigured, isConnecting,
        connectSupabase, disconnectSupabase,
        vendas, caixas, movimentacoes, produtos,
        funcionarios, clientes, fornecedores, financeiro,
        loading, refresh: loadData,
        toasts, showToast, removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
