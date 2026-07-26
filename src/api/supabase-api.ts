import { getSupabaseClient } from '../lib/supabase'

export interface Produto {
  ID: number
  id?: string
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
  id?: string
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
  id?: string
  Nome: string
  CPF?: string
  Telefone?: string
  Email?: string
  Endereco?: string
  SaldoDevedor?: number
}

export interface Funcionario {
  ID: number
  id?: string
  Nome: string
  Cargo?: string
  Telefone?: string
  Ativo: boolean
}

export interface Fornecedor {
  ID: number
  id?: string
  Nome: string
  CNPJ?: string
  Telefone?: string
  Email?: string
}

export interface CaixaSessao {
  ID: number
  id?: string
  ValorAbertura: number
  ValorFechamento?: number
  DataAbertura: string
  DataFechamento?: string
  Status: string
  Observacoes?: string
}

export interface CaixaMovimentacao {
  ID: number
  id?: string
  Tipo: string
  Valor: number
  Descricao: string
  Data: string
}

export interface ContaFinanceira {
  ID: number
  id?: string
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
  id?: string
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
  id?: string
  RazaoSocial: string
  NomeFantasia: string
  CNPJ: string
  Endereco: string
  Telefone: string
  Email: string
}

function mapProduto(row: any): Produto {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    Nome: row.nome || '',
    Preco: row.preco_venda || 0,
    Custo: row.preco_custo || 0,
    Estoque: row.estoque_atual || 0,
    EstoqueMinimo: row.estoque_minimo || 5,
    Unidade: row.unidade || 'un',
    CodigoBarras: row.codigo_barras || '',
    NCM: row.ncm || '',
    CFOP: row.cfop || '',
    CEST: row.cest || '',
    Marca: row.marca || '',
    Descricao: row.descricao || '',
    Ativo: row.ativo !== false,
    CriadoEm: row.created_at || '',
    AtualizadoEm: row.updated_at || '',
  }
}

function mapCliente(row: any): Cliente {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    Nome: row.nome || '',
    CPF: row.documento || '',
    Telefone: row.telefone || '',
    Email: row.email || '',
    Endereco: row.endereco || row.logradouro || '',
    SaldoDevedor: row.saldo_devedor || 0,
  }
}

function mapFuncionario(row: any): Funcionario {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    Nome: row.nome || '',
    Cargo: row.cargo || '',
    Telefone: row.telefone || '',
    Ativo: row.status === 'ativo' || row.status === true,
  }
}

function mapFornecedor(row: any): Fornecedor {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    Nome: row.nome || '',
    CNPJ: row.cnpj || '',
    Telefone: row.telefone || '',
    Email: row.email || '',
  }
}

function mapVenda(row: any): Venda {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    ValorTotal: row.valor_total || 0,
    Desconto: row.desconto_total || 0,
    Acrescimo: row.acrescimo_total || 0,
    FormaPagamento: row.tipo_pagamento || '',
    Status: row.status || '',
    Observacoes: row.observacoes || '',
    Vendedor: row.vendedor_nome || row.funcionario?.nome || '',
    Cliente: row.cliente ? { ID: parseInt(row.cliente.id?.replace(/-/g, '').slice(0, 8), 16) || 0, Nome: row.cliente.nome || '' } : undefined,
    Itens: row.venda_itens?.map((item: any) => ({
      ID: item.id ? parseInt(item.id.replace(/-/g, '').slice(0, 8), 16) : 0,
      ProdutoID: item.produto_id ? parseInt(item.produto_id.replace(/-/g, '').slice(0, 8), 16) : 0,
      Produto: item.produto ? mapProduto(item.produto) : undefined,
      Quantidade: item.quantidade || 0,
      PrecoUnitario: item.preco_unitario || 0,
      Subtotal: item.subtotal || 0,
    })) || [],
    DataVenda: row.data_venda || row.created_at || '',
  }
}

function mapCaixaSessao(row: any): CaixaSessao {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    ValorAbertura: row.saldo_inicial || 0,
    ValorFechamento: row.valor_fechamento_informado || row.saldo_final,
    DataAbertura: row.data_abertura || '',
    DataFechamento: row.data_fechamento || '',
    Status: row.status || '',
    Observacoes: row.observacoes || '',
  }
}

function mapCaixaMovimentacao(row: any): CaixaMovimentacao {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    Tipo: row.tipo || '',
    Valor: row.valor || 0,
    Descricao: row.motivo || '',
    Data: row.data || row.created_at || '',
  }
}

function mapContaFinanceira(row: any): ContaFinanceira {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    Descricao: row.descricao || '',
    Valor: row.valor || 0,
    Tipo: row.tipo || '',
    Status: row.status || '',
    DataVencimento: row.vencimento || '',
    DataPagamento: row.data_pagamento || '',
    Observacoes: row.observacoes || '',
  }
}

function mapConfiguracoes(row: any): Configuracoes {
  return {
    ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
    id: row.id,
    RazaoSocial: row.razao_social || '',
    NomeFantasia: row.nome_fantasia || '',
    CNPJ: row.cnpj || '',
    Endereco: [row.logradouro, row.numero, row.bairro, row.cidade, row.uf].filter(Boolean).join(', ') || '',
    Telefone: row.telefone_contato || '',
    Email: row.email_contato || '',
  }
}

export async function listarProdutos(): Promise<{ data: Produto[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('produtos').select('*').order('nome')
  if (error) throw error
  return { data: (data || []).map(mapProduto) }
}

export async function listarClientes(): Promise<{ data: Cliente[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('clientes').select('*').order('nome')
  if (error) throw error
  return { data: (data || []).map(mapCliente) }
}

export async function listarFuncionarios(): Promise<{ data: Funcionario[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('funcionarios').select('*').order('nome')
  if (error) throw error
  return { data: (data || []).map(mapFuncionario) }
}

export async function listarFornecedores(): Promise<{ data: Fornecedor[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('fornecedores').select('*').order('nome')
  if (error) throw error
  return { data: (data || []).map(mapFornecedor) }
}

export async function listarVendas(): Promise<{ data: Venda[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client
    .from('vendas')
    .select('*, cliente:clientes(id, nome), venda_itens(*, produto:produtos(*))')
    .order('data_venda', { ascending: false })
  if (error) throw error
  return { data: (data || []).map(mapVenda) }
}

export async function listarHistoricoCaixa(): Promise<{ data: CaixaSessao[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('caixa_sessoes').select('*').order('data_abertura', { ascending: false })
  if (error) throw error
  return { data: (data || []).map(mapCaixaSessao) }
}

export async function listarMovimentacoesCaixa(caixaId: number): Promise<{ data: CaixaMovimentacao[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('caixa_movimentacoes').select('*').eq('caixa_id', caixaId).order('data')
  if (error) throw error
  return { data: (data || []).map(mapCaixaMovimentacao) }
}

export interface RelatorioContadorItem {
  VendaID: number
  Data: string
  Cliente: string
  ValorTotal: number
  FormaPagamento: string
  StatusNF: string
}

export async function obterSessaoAtiva(): Promise<{ data: CaixaSessao | null }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('caixa_sessoes').select('*').eq('status', 'aberto').limit(1).single()
  if (error && error.code !== 'PGRST116') throw error
  return { data: data ? mapCaixaSessao(data) : null }
}

export async function listarContas(): Promise<{ data: ContaFinanceira[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('financeiro_contas').select('*').order('vencimento', { ascending: false })
  if (error) throw error
  return { data: (data || []).map(mapContaFinanceira) }
}

export async function listarMovimentacoesEstoque(): Promise<{ data: MovimentacaoEstoque[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('movimentacoes_estoque').select('*, produto:produtos(nome)').order('data', { ascending: false })
  if (error) throw error
  return {
    data: (data || []).map((row: any) => ({
      ID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
      ProdutoID: row.produto_id ? parseInt(row.produto_id.replace(/-/g, '').slice(0, 8), 16) : 0,
      Produto: row.produto ? { ID: 0, Nome: row.produto.nome || '', Preco: 0, Estoque: 0, Ativo: true, CriadoEm: '', AtualizadoEm: '' } : undefined,
      Tipo: row.tipo || '',
      Quantidade: row.quantidade || 0,
      Descricao: row.descricao || '',
      Data: row.data || row.created_at || '',
    })),
  }
}

export async function obterConfiguracoes(): Promise<{ data: Configuracoes | null }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client.from('empresa_configuracoes').select('*').limit(1).single()
  if (error && error.code !== 'PGRST116') throw error
  return { data: data ? mapConfiguracoes(data) : null }
}

export async function relatorioEstoque(periodo: string): Promise<{ data: RelatorioEstoque[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')

  const agora = new Date()
  let dataInicio: string

  if (periodo === 'dia') {
    dataInicio = agora.toISOString().split('T')[0]
  } else if (periodo === 'semana') {
    const d = new Date(agora)
    d.setDate(d.getDate() - 7)
    dataInicio = d.toISOString()
  } else {
    const d = new Date(agora)
    d.setMonth(d.getMonth() - 1)
    dataInicio = d.toISOString()
  }

  const { data: movs, error } = await client
    .from('movimentacoes_estoque')
    .select('*, produto:produtos(nome)')
    .gte('data', dataInicio)
    .order('data', { ascending: false })

  if (error) throw error

  const map = new Map<string, RelatorioEstoque>()
  for (const mov of movs || []) {
    const key = mov.produto_id || 'unknown'
    if (!map.has(key)) {
      map.set(key, {
        ProdutoID: mov.produto_id ? parseInt(mov.produto_id.replace(/-/g, '').slice(0, 8), 16) : 0,
        ProdutoNome: mov.produto?.nome || 'Produto',
        Entradas: 0,
        Saidas: 0,
        Saldo: 0,
      })
    }
    const item = map.get(key)!
    if (mov.tipo === 'entrada') {
      item.Entradas += mov.quantidade || 0
    } else {
      item.Saidas += mov.quantidade || 0
    }
    item.Saldo = item.Entradas - item.Saidas
  }

  return { data: Array.from(map.values()) }
}

export async function relatorioContador(params: { data_inicio: string; data_fim: string }): Promise<{ data: any[] }> {
  const client = getSupabaseClient()
  if (!client) throw new Error('Nenhuma loja selecionada')
  const { data, error } = await client
    .from('vendas')
    .select('id, data_venda, valor_total, tipo_pagamento, status, cliente:clientes(nome)')
    .gte('data_venda', params.data_inicio)
    .lte('data_venda', params.data_fim)
    .order('data_venda', { ascending: false })
  if (error) throw error
  return {
    data: (data || []).map((row: any) => ({
      VendaID: row.id ? parseInt(row.id.replace(/-/g, '').slice(0, 8), 16) : 0,
      Data: row.data_venda ? new Date(row.data_venda).toLocaleDateString('pt-BR') : '',
      Cliente: row.cliente?.nome || '-',
      ValorTotal: row.valor_total || 0,
      FormaPagamento: row.tipo_pagamento || '',
      StatusNF: row.status || '',
    })),
  }
}
