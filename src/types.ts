export type ViewType = 
  | 'dashboard'
  | 'vendas'
  | 'financeiro'
  | 'caixas'
  | 'relatorios'
  | 'estoque'
  | 'clientes'
  | 'funcionarios'
  | 'fornecedores'
  | 'lojas';

export interface StoreConfig {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isConnected: boolean;
  isPrimary?: boolean;
  createdAt: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Inativo';
  categoria: string;
  previsaoEntrega?: string;
  endereco?: string;
  observacoes?: string;
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  precoVenda: number;
  precoCusto: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  unidade: string;
  fornecedorId?: string;
  fornecedorNome?: string;
  imagemUrl?: string;
}

export interface ItemVenda {
  produtoId: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  codigoVenda: string;
  data: string;
  clienteNome: string;
  clienteCpf?: string;
  vendedorNome: string;
  itens: ItemVenda[];
  total: number;
  desconto: number;
  formaPagamento: 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Fiado';
  status: 'Concluída' | 'Cancelada' | 'Pendente';
  lojaId: string;
}

export interface MovimentacaoCaixa {
  id: string;
  tipo: 'Abertura' | 'Venda' | 'Sangria' | 'Suprimento' | 'Fechamento';
  descricao: string;
  valor: number;
  formaPagamento?: string;
  data: string;
  operador: string;
}

export interface Caixa {
  id: string;
  lojaId: string;
  dataAbertura: string;
  dataFechamento?: string;
  saldoInicial: number;
  saldoFinalEstimado: number;
  saldoFinalReal?: number;
  status: 'Aberto' | 'Fechado';
  operador: string;
  movimentacoes: MovimentacaoCaixa[];
}

export interface TransacaoFinanceira {
  id: string;
  descricao: string;
  tipo: 'Receita' | 'Despesa';
  categoria: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  fornecedorOuCliente?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  cidade: string;
  totalComprado: number;
  ultimaCompra?: string;
  status: 'Ativo' | 'Inativo';
}

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  cargo: 'Gerente' | 'Caixa' | 'Vendedor' | 'Estoquista';
  telefone: string;
  email: string;
  salario: number;
  comissaoPorcentagem: number;
  totalVendasMes: number;
  status: 'Ativo' | 'Inativo';
}
