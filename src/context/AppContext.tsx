import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewType,
  StoreConfig,
  Fornecedor,
  Produto,
  Venda,
  Cliente,
  Funcionario,
  TransacaoFinanceira,
  Caixa,
  MovimentacaoCaixa
} from '../types';
import {
  initialStores,
  initialFornecedores,
  initialProdutos,
  initialVendas,
  initialClientes,
  initialFuncionarios,
  initialFinanceiro,
  initialCaixa
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  stores: StoreConfig[];
  activeStoreId: string;
  activeStore: StoreConfig | undefined;
  setActiveStoreId: (id: string) => void;
  isStoreModalOpen: boolean;
  setIsStoreModalOpen: (open: boolean) => void;
  
  fornecedores: Fornecedor[];
  addFornecedor: (fornecedor: Omit<Fornecedor, 'id'>) => void;
  updateFornecedor: (id: string, fornecedor: Partial<Fornecedor>) => void;
  deleteFornecedor: (id: string) => void;
  
  produtos: Produto[];
  addProduto: (produto: Omit<Produto, 'id'>) => void;
  updateProduto: (id: string, produto: Partial<Produto>) => void;
  deleteProduto: (id: string) => void;
  
  vendas: Venda[];
  addVenda: (venda: Omit<Venda, 'id' | 'codigoVenda' | 'data'>) => Venda;
  
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'totalComprado'>) => void;
  
  funcionarios: Funcionario[];
  addFuncionario: (funcionario: Omit<Funcionario, 'id' | 'totalVendasMes'>) => void;
  
  financeiro: TransacaoFinanceira[];
  addTransacaoFinanceira: (transacao: Omit<TransacaoFinanceira, 'id'>) => void;
  
  caixa: Caixa;
  addMovimentacaoCaixa: (mov: Omit<MovimentacaoCaixa, 'id' | 'data'>) => void;
  fecharCaixa: (valorReal: number) => void;
  abrirCaixa: (saldoInicial: number, operador: string) => void;
  
  addStore: (store: Omit<StoreConfig, 'id' | 'createdAt'>) => void;
  updateStoreConfig: (id: string, config: Partial<StoreConfig>) => void;
  
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('fornecedores');
  
  // Load initial state from localStorage or mockData
  const [stores, setStores] = useState<StoreConfig[]>(() => {
    const saved = localStorage.getItem('clickup_stores');
    return saved ? JSON.parse(saved) : initialStores;
  });
  
  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    const saved = localStorage.getItem('clickup_active_store');
    return saved || 'store-1';
  });
  
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);
  
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    const saved = localStorage.getItem('clickup_fornecedores');
    return saved ? JSON.parse(saved) : initialFornecedores;
  });
  
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const saved = localStorage.getItem('clickup_produtos');
    return saved ? JSON.parse(saved) : initialProdutos;
  });
  
  const [vendas, setVendas] = useState<Venda[]>(() => {
    const saved = localStorage.getItem('clickup_vendas');
    return saved ? JSON.parse(saved) : initialVendas;
  });
  
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('clickup_clientes');
    return saved ? JSON.parse(saved) : initialClientes;
  });
  
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const saved = localStorage.getItem('clickup_funcionarios');
    return saved ? JSON.parse(saved) : initialFuncionarios;
  });
  
  const [financeiro, setFinanceiro] = useState<TransacaoFinanceira[]>(() => {
    const saved = localStorage.getItem('clickup_financeiro');
    return saved ? JSON.parse(saved) : initialFinanceiro;
  });
  
  const [caixa, setCaixa] = useState<Caixa>(() => {
    const saved = localStorage.getItem('clickup_caixa');
    return saved ? JSON.parse(saved) : initialCaixa;
  });
  
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('clickup_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('clickup_active_store', activeStoreId);
  }, [activeStoreId]);

  useEffect(() => {
    localStorage.setItem('clickup_fornecedores', JSON.stringify(fornecedores));
  }, [fornecedores]);

  useEffect(() => {
    localStorage.setItem('clickup_produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('clickup_vendas', JSON.stringify(vendas));
  }, [vendas]);

  useEffect(() => {
    localStorage.setItem('clickup_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('clickup_funcionarios', JSON.stringify(funcionarios));
  }, [funcionarios]);

  useEffect(() => {
    localStorage.setItem('clickup_financeiro', JSON.stringify(financeiro));
  }, [financeiro]);

  useEffect(() => {
    localStorage.setItem('clickup_caixa', JSON.stringify(caixa));
  }, [caixa]);

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0];

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fornecedores actions
  const addFornecedor = (fornecedorData: Omit<Fornecedor, 'id'>) => {
    const newForn: Fornecedor = {
      ...fornecedorData,
      id: 'forn-' + Date.now()
    };
    setFornecedores(prev => [newForn, ...prev]);
    showToast(`Fornecedor "${newForn.nome}" cadastrado com sucesso!`);
  };

  const updateFornecedor = (id: string, fornecedorData: Partial<Fornecedor>) => {
    setFornecedores(prev =>
      prev.map(item => (item.id === id ? { ...item, ...fornecedorData } : item))
    );
    showToast('Fornecedor atualizado com sucesso!');
  };

  const deleteFornecedor = (id: string) => {
    setFornecedores(prev => prev.filter(item => item.id !== id));
    showToast('Fornecedor removido', 'info');
  };

  // Produtos actions
  const addProduto = (prodData: Omit<Produto, 'id'>) => {
    const newProd: Produto = {
      ...prodData,
      id: 'prod-' + Date.now()
    };
    setProdutos(prev => [newProd, ...prev]);
    showToast(`Produto "${newProd.nome}" cadastrado com sucesso!`);
  };

  const updateProduto = (id: string, prodData: Partial<Produto>) => {
    setProdutos(prev =>
      prev.map(item => (item.id === id ? { ...item, ...prodData } : item))
    );
    showToast('Produto atualizado!');
  };

  const deleteProduto = (id: string) => {
    setProdutos(prev => prev.filter(item => item.id !== id));
    showToast('Produto removido', 'info');
  };

  // Vendas actions
  const addVenda = (vendaData: Omit<Venda, 'id' | 'codigoVenda' | 'data'>): Venda => {
    const count = vendas.length + 105;
    const newVenda: Venda = {
      ...vendaData,
      id: 'venda-' + Date.now(),
      codigoVenda: `VND-${String(count).padStart(5, '0')}`,
      data: new Date().toISOString()
    };

    setVendas(prev => [newVenda, ...prev]);

    // Deduct stock for each product
    vendaData.itens.forEach(item => {
      setProdutos(prevProds =>
        prevProds.map(p => {
          if (p.id === item.produtoId) {
            const novoEstoque = Math.max(0, p.estoqueAtual - item.quantidade);
            return { ...p, estoqueAtual: novoEstoque };
          }
          return p;
        })
      );
    });

    // Add to active caixa if open
    if (caixa.status === 'Aberto') {
      addMovimentacaoCaixa({
        tipo: 'Venda',
        descricao: `Venda ${newVenda.codigoVenda} (${newVenda.formaPagamento})`,
        valor: newVenda.total,
        formaPagamento: newVenda.formaPagamento,
        operador: newVenda.vendedorNome || caixa.operador
      });
    }

    showToast(`Venda ${newVenda.codigoVenda} realizada com sucesso!`);
    return newVenda;
  };

  // Clientes actions
  const addCliente = (clienteData: Omit<Cliente, 'id' | 'totalComprado'>) => {
    const newCli: Cliente = {
      ...clienteData,
      id: 'cli-' + Date.now(),
      totalComprado: 0
    };
    setClientes(prev => [newCli, ...prev]);
    showToast(`Cliente "${newCli.nome}" cadastrado!`);
  };

  // Funcionários actions
  const addFuncionario = (funcData: Omit<Funcionario, 'id' | 'totalVendasMes'>) => {
    const newFunc: Funcionario = {
      ...funcData,
      id: 'func-' + Date.now(),
      totalVendasMes: 0
    };
    setFuncionarios(prev => [newFunc, ...prev]);
    showToast(`Funcionário "${newFunc.nome}" cadastrado!`);
  };

  // Financeiro actions
  const addTransacaoFinanceira = (transacaoData: Omit<TransacaoFinanceira, 'id'>) => {
    const newFin: TransacaoFinanceira = {
      ...transacaoData,
      id: 'fin-' + Date.now()
    };
    setFinanceiro(prev => [newFin, ...prev]);
    showToast('Lançamento financeiro registrado com sucesso!');
  };

  // Caixa actions
  const addMovimentacaoCaixa = (movData: Omit<MovimentacaoCaixa, 'id' | 'data'>) => {
    const newMov: MovimentacaoCaixa = {
      ...movData,
      id: 'mov-' + Date.now(),
      data: new Date().toISOString()
    };

    setCaixa(prev => {
      let delta = 0;
      if (movData.tipo === 'Venda' || movData.tipo === 'Suprimento') {
        delta = movData.valor;
      } else if (movData.tipo === 'Sangria') {
        delta = -movData.valor;
      }
      return {
        ...prev,
        saldoFinalEstimado: Math.max(0, prev.saldoFinalEstimado + delta),
        movimentacoes: [newMov, ...prev.movimentacoes]
      };
    });
  };

  const fecharCaixa = (valorReal: number) => {
    setCaixa(prev => ({
      ...prev,
      status: 'Fechado',
      dataFechamento: new Date().toISOString(),
      saldoFinalReal: valorReal
    }));
    showToast('Caixa fechado com sucesso!', 'info');
  };

  const abrirCaixa = (saldoInicial: number, operador: string) => {
    const newCaixa: Caixa = {
      id: 'cx-' + Date.now(),
      lojaId: activeStoreId,
      dataAbertura: new Date().toISOString(),
      saldoInicial,
      saldoFinalEstimado: saldoInicial,
      status: 'Aberto',
      operador,
      movimentacoes: [
        {
          id: 'mov-init-' + Date.now(),
          tipo: 'Abertura',
          descricao: 'Fundo de Troco Inicial',
          valor: saldoInicial,
          data: new Date().toISOString(),
          operador
        }
      ]
    };
    setCaixa(newCaixa);
    showToast('Caixa aberto com sucesso!');
  };

  // Stores actions
  const addStore = (storeData: Omit<StoreConfig, 'id' | 'createdAt'>) => {
    const newStore: StoreConfig = {
      ...storeData,
      id: 'store-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setStores(prev => [...prev, newStore]);
    setActiveStoreId(newStore.id);
    showToast(`Loja "${newStore.name}" configurada!`);
  };

  const updateStoreConfig = (id: string, config: Partial<StoreConfig>) => {
    setStores(prev =>
      prev.map(s => (s.id === id ? { ...s, ...config } : s))
    );
    showToast('Configurações da loja salvas com sucesso!');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        stores,
        activeStoreId,
        activeStore,
        setActiveStoreId,
        isStoreModalOpen,
        setIsStoreModalOpen,
        fornecedores,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor,
        produtos,
        addProduto,
        updateProduto,
        deleteProduto,
        vendas,
        addVenda,
        clientes,
        addCliente,
        funcionarios,
        addFuncionario,
        financeiro,
        addTransacaoFinanceira,
        caixa,
        addMovimentacaoCaixa,
        fecharCaixa,
        abrirCaixa,
        addStore,
        updateStoreConfig,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
