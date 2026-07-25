import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export interface Produto {
  ID: number
  Nome: string
  Preco: number
  Custo?: number
  Estoque: number
  EstoqueMinimo?: number
  Unidade?: string
  CodigoBarras?: string
  NCM?: string
  CFOP?: string
  CEST?: string
  Marca?: string
  Descricao?: string
  Ativo: boolean
  CriadoEm: string
  AtualizadoEm: string
}

export interface Venda {
  ID: number
  ValorTotal: number
  Desconto?: number
  Acrescimo?: number
  FormaPagamento: string
  Status: string
  Observacoes?: string
  Vendedor?: string
  Cliente?: { ID: number; Nome: string }
  Itens?: VendaItem[]
  DataVenda: string
}

export interface VendaItem {
  ID: number
  ProdutoID: number
  Produto?: Produto
  Quantidade: number
  PrecoUnitario: number
  Subtotal: number
}

export interface Cliente {
  ID: number
  Nome: string
  CPF?: string
  Telefone?: string
  Email?: string
  Endereco?: string
  SaldoDevedor?: number
}

export interface Funcionario {
  ID: number
  Nome: string
  Cargo?: string
  Telefone?: string
  Ativo: boolean
}

export interface Fornecedor {
  ID: number
  Nome: string
  CNPJ?: string
  Telefone?: string
  Email?: string
}

export interface CaixaSessao {
  ID: number
  ValorAbertura: number
  ValorFechamento?: number
  DataAbertura: string
  DataFechamento?: string
  Status: string
  Observacoes?: string
}

export interface CaixaMovimentacao {
  ID: number
  Tipo: string
  Valor: number
  Descricao: string
  Data: string
}

export interface ContaFinanceira {
  ID: number
  Descricao: string
  Valor: number
  Tipo: string
  Status: string
  DataVencimento: string
  DataPagamento?: string
  Observacoes?: string
}

export interface MovimentacaoEstoque {
  ID: number
  ProdutoID: number
  Produto?: Produto
  Tipo: string
  Quantidade: number
  Descricao: string
  Data: string
}

export interface RelatorioEstoque {
  ProdutoID: number
  ProdutoNome: string
  Entradas: number
  Saidas: number
  Saldo: number
}

export interface Configuracoes {
  ID: number
  RazaoSocial: string
  NomeFantasia: string
  CNPJ: string
  Endereco: string
  Telefone: string
  Email: string
}

export interface RelatorioContadorItem {
  VendaID: number
  Data: string
  Cliente: string
  ValorTotal: number
  FormaPagamento: string
  StatusNF: string
}

// Produtos
export const listarProdutos = () => api.get<Produto[]>('/produtos/')
export const salvarProduto = (p: Partial<Produto>) => api.post<Produto>('/produtos/', p)
export const deletarProduto = (id: number) => api.delete(`/produtos/${id}`)

// Vendas
export const listarVendas = () => api.get<Venda[]>('/vendas/')
export const cancelarVenda = (id: number) => api.patch(`/vendas/${id}/cancelar`)

// Clientes
export const listarClientes = () => api.get<Cliente[]>('/clientes/')
export const salvarCliente = (c: Partial<Cliente>) => api.post<Cliente>('/clientes/', c)

// Funcionarios
export const listarFuncionarios = () => api.get<Funcionario[]>('/funcionarios/')
export const salvarFuncionario = (f: Partial<Funcionario>) => api.post<Funcionario>('/funcionarios/', f)

// Fornecedores
export const listarFornecedores = () => api.get<Fornecedor[]>('/fornecedores/')
export const salvarFornecedor = (f: Partial<Fornecedor>) => api.post<Fornecedor>('/fornecedores/', f)

// Caixa
export const obterSessaoAtiva = () => api.get<CaixaSessao | null>('/caixa/ativo')
export const listarHistoricoCaixa = () => api.get<CaixaSessao[]>('/caixa/historico')
export const listarMovimentacoesCaixa = (id: number) => api.get<CaixaMovimentacao[]>(`/caixa/movimentacoes/${id}`)

// Financeiro
export const listarContas = () => api.get<ContaFinanceira[]>('/financeiro/')
export const salvarConta = (c: Partial<ContaFinanceira>) => api.post<ContaFinanceira>('/financeiro/', c)

// Movimentacoes Estoque
export const listarMovimentacoesEstoque = (params?: Record<string, string>) =>
  api.get<MovimentacaoEstoque[]>('/movimentacoes-estoque', { params })

// Relatorio Estoque
export const relatorioEstoque = (periodo: string) =>
  api.get<RelatorioEstoque[]>('/relatorio-estoque', { params: { periodo } })

// Configuracoes
export const obterConfiguracoes = () => api.get<Configuracoes>('/configuracoes/')
export const salvarConfiguracoes = (c: Partial<Configuracoes>) => api.post<Configuracoes>('/configuracoes/', c)

// Relatorios Fiscais
export const relatorioContador = (params: { data_inicio: string; data_fim: string; formato?: string }) =>
  api.get<RelatorioContadorItem[]>('/relatorios/contador', { params })

// Fiado
export const listarPagamentosFiado = (clienteId?: number) =>
  api.get('/fiado/', { params: clienteId ? { cliente_id: clienteId } : {} })

export default api
