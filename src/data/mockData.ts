import {
  Fornecedor,
  Produto,
  Venda,
  Cliente,
  Funcionario,
  TransacaoFinanceira,
  StoreConfig,
  Caixa
} from '../types';

export const initialStores: StoreConfig[] = [
  {
    id: 'store-1',
    name: 'Loja Matriz - Centro',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    isConnected: true,
    isPrimary: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'store-2',
    name: 'Filial Shopping',
    cnpj: '12.345.678/0002-71',
    address: 'Shopping Center Norte, Lj 204 - São Paulo, SP',
    isConnected: false,
    isPrimary: false,
    createdAt: '2026-03-10'
  }
];

export const initialFornecedores: Fornecedor[] = [
  {
    id: 'forn-1',
    nome: 'Distribuidora Brasil S.A.',
    cnpj: '45.890.123/0001-44',
    contato: 'Roberto Almeida',
    telefone: '(11) 98765-4321',
    email: 'comercial@distribuidorabrasil.com.br',
    status: 'Ativo',
    categoria: 'Bebidas e Mantimentos',
    previsaoEntrega: 'Terça-feira',
    endereco: 'Rua das Indústrias, 500 - Guarulhos, SP'
  },
  {
    id: 'forn-2',
    nome: 'Ambev Distribuição regional',
    cnpj: '03.221.567/0001-89',
    contato: 'Juliana Costa',
    telefone: '(11) 97123-8899',
    email: 'pedidos@ambev.com.br',
    status: 'Ativo',
    categoria: 'Bebidas',
    previsaoEntrega: 'Amanhã (14h)',
    endereco: 'Rodovia Anhangüera, Km 22 - Osasco, SP'
  },
  {
    id: 'forn-3',
    nome: 'Atacadão Alimentos & Utilidades',
    cnpj: '19.443.011/0001-02',
    contato: 'Marcos Vinicius',
    telefone: '(11) 96543-1122',
    email: 'vendas@atacadaoalimentos.com.br',
    status: 'Ativo',
    categoria: 'Alimentício',
    previsaoEntrega: 'Quinta-feira',
    endereco: 'Av. das Nações Unidas, 1200 - São Paulo, SP'
  },
  {
    id: 'forn-4',
    nome: 'Moda & Confeções Express',
    cnpj: '28.109.876/0001-33',
    contato: 'Camila Rocha',
    telefone: '(11) 99881-2233',
    email: 'contato@modaexpress.com.br',
    status: 'Ativo',
    categoria: 'Vestuário',
    previsaoEntrega: 'Sexta-feira',
    endereco: 'Rua Silva Pinto, 340 - Bom Retiro, São Paulo, SP'
  },
  {
    id: 'forn-5',
    nome: 'Eletro Tech Importadora',
    cnpj: '33.987.654/0001-55',
    contato: 'Lucas Santos',
    telefone: '(11) 95544-3322',
    email: 'suporte@eletrotech.com',
    status: 'Inativo',
    categoria: 'Eletrônicos',
    previsaoEntrega: 'Sem previsão',
    endereco: 'Rua Santa Ifigênia, 120 - São Paulo, SP'
  },
  {
    id: 'forn-6',
    nome: 'Embalagens & Cia',
    cnpj: '08.112.334/0001-77',
    contato: 'Fernanda Lima',
    telefone: '(11) 94321-9988',
    email: 'contato@embalagenscia.com.br',
    status: 'Ativo',
    categoria: 'Insumos',
    previsaoEntrega: 'Quarta-feira',
    endereco: 'Rua do Bosque, 890 - São Paulo, SP'
  }
];

export const initialProdutos: Produto[] = [
  {
    id: 'prod-1',
    codigo: '78910001001',
    nome: 'Refrigerante Cola 2L',
    categoria: 'Bebidas',
    precoVenda: 9.90,
    precoCusto: 5.20,
    estoqueAtual: 48,
    estoqueMinimo: 15,
    unidade: 'UN',
    fornecedorId: 'forn-2',
    fornecedorNome: 'Ambev Distribuição regional'
  },
  {
    id: 'prod-2',
    codigo: '78910001002',
    nome: 'Cerveja Puro Malte 350ml (Lata)',
    categoria: 'Bebidas',
    precoVenda: 4.50,
    precoCusto: 2.30,
    estoqueAtual: 120,
    estoqueMinimo: 40,
    unidade: 'UN',
    fornecedorId: 'forn-2',
    fornecedorNome: 'Ambev Distribuição regional'
  },
  {
    id: 'prod-3',
    codigo: '78910001003',
    nome: 'Arroz Tipo 1 - 5kg',
    categoria: 'Alimentício',
    precoVenda: 28.90,
    precoCusto: 19.50,
    estoqueAtual: 8,
    estoqueMinimo: 10,
    unidade: 'UN',
    fornecedorId: 'forn-3',
    fornecedorNome: 'Atacadão Alimentos & Utilidades'
  },
  {
    id: 'prod-4',
    codigo: '78910001004',
    nome: 'Feijão Carioca - 1kg',
    categoria: 'Alimentício',
    precoVenda: 8.50,
    precoCusto: 5.10,
    estoqueAtual: 25,
    estoqueMinimo: 12,
    unidade: 'UN',
    fornecedorId: 'forn-3',
    fornecedorNome: 'Atacadão Alimentos & Utilidades'
  },
  {
    id: 'prod-5',
    codigo: '78910001005',
    nome: 'Camiseta Algodão Básica M',
    categoria: 'Vestuário',
    precoVenda: 49.90,
    precoCusto: 21.00,
    estoqueAtual: 32,
    estoqueMinimo: 8,
    unidade: 'UN',
    fornecedorId: 'forn-4',
    fornecedorNome: 'Moda & Confeções Express'
  },
  {
    id: 'prod-6',
    codigo: '78910001006',
    nome: 'Carregador Rápido USB-C 20W',
    categoria: 'Eletrônicos',
    precoVenda: 79.90,
    precoCusto: 32.00,
    estoqueAtual: 4,
    estoqueMinimo: 5,
    unidade: 'UN',
    fornecedorId: 'forn-5',
    fornecedorNome: 'Eletro Tech Importadora'
  }
];

export const initialVendas: Venda[] = [
  {
    id: 'venda-101',
    codigoVenda: 'VND-00101',
    data: '2026-07-26T10:15:00',
    clienteNome: 'Carlos Eduardo Silva',
    clienteCpf: '123.456.789-00',
    vendedorNome: 'Beatriz Santos',
    total: 108.20,
    desconto: 5.00,
    formaPagamento: 'Pix',
    status: 'Concluída',
    lojaId: 'store-1',
    itens: [
      { produtoId: 'prod-1', nome: 'Refrigerante Cola 2L', precoUnitario: 9.90, quantidade: 2, subtotal: 19.80 },
      { produtoId: 'prod-3', nome: 'Arroz Tipo 1 - 5kg', precoUnitario: 28.90, quantidade: 2, subtotal: 57.80 },
      { produtoId: 'prod-4', nome: 'Feijão Carioca - 1kg', precoUnitario: 8.50, quantidade: 4, subtotal: 34.00 }
    ]
  },
  {
    id: 'venda-102',
    codigoVenda: 'VND-00102',
    data: '2026-07-26T11:40:00',
    clienteNome: 'Mariana Oliveira',
    vendedorNome: 'Beatriz Santos',
    total: 129.80,
    desconto: 0,
    formaPagamento: 'Cartão de Crédito',
    status: 'Concluída',
    lojaId: 'store-1',
    itens: [
      { produtoId: 'prod-5', nome: 'Camiseta Algodão Básica M', precoUnitario: 49.90, quantidade: 1, subtotal: 49.90 },
      { produtoId: 'prod-6', nome: 'Carregador Rápido USB-C 20W', precoUnitario: 79.90, quantidade: 1, subtotal: 79.90 }
    ]
  },
  {
    id: 'venda-103',
    codigoVenda: 'VND-00103',
    data: '2026-07-25T16:20:00',
    clienteNome: 'Consumidor Final',
    vendedorNome: 'Ricardo Prado',
    total: 31.50,
    desconto: 0,
    formaPagamento: 'Dinheiro',
    status: 'Concluída',
    lojaId: 'store-1',
    itens: [
      { produtoId: 'prod-2', nome: 'Cerveja Puro Malte 350ml (Lata)', precoUnitario: 4.50, quantidade: 7, subtotal: 31.50 }
    ]
  },
  {
    id: 'venda-104',
    codigoVenda: 'VND-00104',
    data: '2026-07-25T14:10:00',
    clienteNome: 'Fernanda Machado',
    vendedorNome: 'Beatriz Santos',
    total: 86.70,
    desconto: 3.00,
    formaPagamento: 'Pix',
    status: 'Concluída',
    lojaId: 'store-1',
    itens: [
      { produtoId: 'prod-1', nome: 'Refrigerante Cola 2L', precoUnitario: 9.90, quantidade: 3, subtotal: 29.70 },
      { produtoId: 'prod-3', nome: 'Arroz Tipo 1 - 5kg', precoUnitario: 28.90, quantidade: 2, subtotal: 57.80 }
    ]
  }
];

export const initialClientes: Cliente[] = [
  {
    id: 'cli-1',
    nome: 'Carlos Eduardo Silva',
    cpfCnpj: '123.456.789-00',
    telefone: '(11) 98111-2233',
    email: 'carlos.silva@email.com',
    cidade: 'São Paulo - SP',
    totalComprado: 1450.80,
    ultimaCompra: '2026-07-26',
    status: 'Ativo'
  },
  {
    id: 'cli-2',
    nome: 'Mariana Oliveira',
    cpfCnpj: '987.654.321-11',
    telefone: '(11) 97222-3344',
    email: 'mari.oliveira@email.com',
    cidade: 'São Paulo - SP',
    totalComprado: 890.00,
    ultimaCompra: '2026-07-26',
    status: 'Ativo'
  },
  {
    id: 'cli-3',
    nome: 'Fernanda Machado',
    cpfCnpj: '456.789.123-22',
    telefone: '(11) 96333-4455',
    email: 'fer.machado@email.com',
    cidade: 'Santo André - SP',
    totalComprado: 320.50,
    ultimaCompra: '2026-07-25',
    status: 'Ativo'
  },
  {
    id: 'cli-4',
    nome: 'Padaria e Confeitaria Central LTDA',
    cpfCnpj: '11.222.333/0001-44',
    telefone: '(11) 3211-8899',
    email: 'financeiro@padariacentral.com',
    cidade: 'São Paulo - SP',
    totalComprado: 4890.00,
    ultimaCompra: '2026-07-20',
    status: 'Ativo'
  }
];

export const initialFuncionarios: Funcionario[] = [
  {
    id: 'func-1',
    nome: 'Beatriz Santos',
    cpf: '333.444.555-66',
    cargo: 'Caixa',
    telefone: '(11) 98877-6655',
    email: 'beatriz@clickupvendas.com.br',
    salario: 2400.00,
    comissaoPorcentagem: 2.0,
    totalVendasMes: 12850.00,
    status: 'Ativo'
  },
  {
    id: 'func-2',
    nome: 'Ricardo Prado',
    cpf: '222.111.444-88',
    cargo: 'Vendedor',
    telefone: '(11) 97766-5544',
    email: 'ricardo@clickupvendas.com.br',
    salario: 2200.00,
    comissaoPorcentagem: 3.5,
    totalVendasMes: 18900.00,
    status: 'Ativo'
  },
  {
    id: 'func-3',
    nome: 'Julio Cesar Alencar',
    cpf: '555.666.777-99',
    cargo: 'Gerente',
    telefone: '(11) 99988-1122',
    email: 'gerencia@clickupvendas.com.br',
    salario: 4800.00,
    comissaoPorcentagem: 1.0,
    totalVendasMes: 31750.00,
    status: 'Ativo'
  }
];

export const initialFinanceiro: TransacaoFinanceira[] = [
  {
    id: 'fin-1',
    descricao: 'Pagamento Pedido Bebidas Ambev',
    tipo: 'Despesa',
    categoria: 'Fornecedores',
    valor: 1850.00,
    dataVencimento: '2026-07-28',
    status: 'Pendente',
    fornecedorOuCliente: 'Ambev Distribuição regional'
  },
  {
    id: 'fin-2',
    descricao: 'Recebimento de Vendas Pix/Cartão',
    tipo: 'Receita',
    categoria: 'Vendas PDV',
    valor: 3560.40,
    dataVencimento: '2026-07-26',
    dataPagamento: '2026-07-26',
    status: 'Pago'
  },
  {
    id: 'fin-3',
    descricao: 'Aluguel do Imóvel Matriz',
    tipo: 'Despesa',
    categoria: 'Infraestrutura',
    valor: 3200.00,
    dataVencimento: '2026-08-05',
    status: 'Pendente',
    fornecedorOuCliente: 'Imobiliária Central'
  },
  {
    id: 'fin-4',
    descricao: 'Luz e Energia Elétrica Enel',
    tipo: 'Despesa',
    categoria: 'Utilidades',
    valor: 640.80,
    dataVencimento: '2026-07-24',
    dataPagamento: '2026-07-23',
    status: 'Pago',
    fornecedorOuCliente: 'Enel Distribuição'
  }
];

export const initialCaixa: Caixa = {
  id: 'cx-2026-07-26',
  lojaId: 'store-1',
  dataAbertura: '2026-07-26T08:00:00',
  saldoInicial: 250.00,
  saldoFinalEstimado: 619.50,
  status: 'Aberto',
  operador: 'Beatriz Santos',
  movimentacoes: [
    {
      id: 'mov-1',
      tipo: 'Abertura',
      descricao: 'Fundo de Troco Inicial',
      valor: 250.00,
      data: '2026-07-26T08:00:00',
      operador: 'Beatriz Santos'
    },
    {
      id: 'mov-2',
      tipo: 'Venda',
      descricao: 'Venda VND-00101 (Pix)',
      valor: 108.20,
      formaPagamento: 'Pix',
      data: '2026-07-26T10:15:00',
      operador: 'Beatriz Santos'
    },
    {
      id: 'mov-3',
      tipo: 'Venda',
      descricao: 'Venda VND-00102 (Cartão de Crédito)',
      valor: 129.80,
      formaPagamento: 'Cartão de Crédito',
      data: '2026-07-26T11:40:00',
      operador: 'Beatriz Santos'
    },
    {
      id: 'mov-4',
      tipo: 'Suprimento',
      descricao: 'Aporte para Troco extra',
      valor: 100.00,
      data: '2026-07-26T12:00:00',
      operador: 'Julio Cesar Alencar'
    },
    {
      id: 'mov-5',
      tipo: 'Sangria',
      descricao: 'Retirada de segurança',
      valor: 68.50,
      data: '2026-07-26T13:30:00',
      operador: 'Beatriz Santos'
    }
  ]
};
