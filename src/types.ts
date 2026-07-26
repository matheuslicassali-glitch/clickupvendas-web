export type ViewType =
  | 'dashboard'
  | 'vendas'
  | 'caixas'
  | 'financeiro'
  | 'relatorios'
  | 'estoque'
  | 'funcionarios'
  | 'clientes'
  | 'fornecedores';

export type PeriodoFiltro = 'hoje' | 'semana' | 'mes';

export interface Venda {
  id: string;
  codigo: string;
  data: string;
  cliente_nome: string;
  vendedor_nome: string;
  total: number;
  desconto: number;
  forma_pagamento: string;
  status: string;
  caixa_id: string;
}

export interface VendaItem {
  id: string;
  venda_id: string;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface CaixaSessao {
  id: string;
  data_abertura: string;
  data_fechamento: string | null;
  saldo_inicial: number;
  saldo_final: number | null;
  status: string;
  operador: string;
}

export interface CaixaMovimentacao {
  id: string;
  caixa_id: string;
  tipo: string;
  descricao: string;
  valor: number;
  forma_pagamento: string | null;
  data: string;
  operador: string;
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  preco_venda: number;
  estoque_atual: number;
  estoque_minimo: number;
  unidade: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  status: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpf_cnpj: string;
  telefone: string;
  email: string;
  status: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  telefone: string;
  email: string;
  status: string;
  categoria: string;
}

export interface FinanceiroConta {
  id: string;
  descricao: string;
  tipo: string;
  categoria: string;
  valor: number;
  data_vencimento: string;
  data_pagamento: string | null;
  status: string;
  pessoa: string | null;
}
