-- ============================================
-- CLICKUP VENDAS - SUPABASE SCHEMA
-- Execute no Supabase SQL Editor
-- ============================================

-- Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  codigo_barras TEXT,
  preco_venda NUMERIC(15,2) NOT NULL DEFAULT 0,
  preco_custo NUMERIC(15,2) DEFAULT 0,
  estoque_atual NUMERIC(15,2) DEFAULT 0,
  estoque_minimo NUMERIC(15,2) DEFAULT 0,
  unidade TEXT DEFAULT 'UN',
  categoria TEXT,
  ncm TEXT,
  cfop TEXT,
  cst_csosn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  documento TEXT UNIQUE NOT NULL,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  uf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funcionarios
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'Ativo',
  comissao NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  contato TEXT,
  categoria TEXT,
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendas
CREATE TABLE IF NOT EXISTS vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL,
  data TIMESTAMPTZ DEFAULT NOW(),
  cliente_nome TEXT,
  vendedor_nome TEXT,
  total NUMERIC(15,2) NOT NULL DEFAULT 0,
  desconto NUMERIC(15,2) DEFAULT 0,
  forma_pagamento TEXT,
  status TEXT DEFAULT 'Concluida',
  caixa_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venda Itens
CREATE TABLE IF NOT EXISTS venda_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_id UUID REFERENCES vendas(id) ON DELETE CASCADE,
  produto_nome TEXT NOT NULL,
  quantidade NUMERIC(15,2) NOT NULL DEFAULT 1,
  preco_unitario NUMERIC(15,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Caixa Sessoes
CREATE TABLE IF NOT EXISTS caixa_sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_abertura TIMESTAMPTZ DEFAULT NOW(),
  data_fechamento TIMESTAMPTZ,
  saldo_inicial NUMERIC(15,2) DEFAULT 0,
  saldo_final NUMERIC(15,2),
  status TEXT DEFAULT 'Aberto',
  operador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Caixa Movimentacoes
CREATE TABLE IF NOT EXISTS caixa_movimentacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caixa_id UUID REFERENCES caixa_sessoes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descricao TEXT,
  valor NUMERIC(15,2) NOT NULL DEFAULT 0,
  forma_pagamento TEXT,
  data TIMESTAMPTZ DEFAULT NOW(),
  operador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financeiro Contas
CREATE TABLE IF NOT EXISTS financeiro_contas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL,
  categoria TEXT,
  valor NUMERIC(15,2) NOT NULL DEFAULT 0,
  data_vencimento TIMESTAMPTZ NOT NULL,
  data_pagamento TIMESTAMPTZ,
  status TEXT DEFAULT 'Pendente',
  pessoa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(data);
CREATE INDEX IF NOT EXISTS idx_vendas_status ON vendas(status);
CREATE INDEX IF NOT EXISTS idx_venda_itens_venda ON venda_itens(venda_id);
CREATE INDEX IF NOT EXISTS idx_caixa_movimentacoes_caixa ON caixa_movimentacoes(caixa_id);
CREATE INDEX IF NOT EXISTS idx_caixa_movimentacoes_data ON caixa_movimentacoes(data);
CREATE INDEX IF NOT EXISTS idx_financeiro_contas_vencimento ON financeiro_contas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_financeiro_contas_status ON financeiro_contas(status);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Desabilitado para sync
-- ============================================
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE venda_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE caixa_sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE caixa_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro_contas ENABLE ROW LEVEL SECURITY;

-- Policy: Permite tudo para service_role (usado pelo sync)
CREATE POLICY "Allow all for service_role" ON produtos FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON funcionarios FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON fornecedores FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON vendas FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON venda_itens FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON caixa_sessoes FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON caixa_movimentacoes FOR ALL USING (true);
CREATE POLICY "Allow all for service_role" ON financeiro_contas FOR ALL USING (true);

-- Policy: Leitura para anon (web app)
CREATE POLICY "Allow read for anon" ON produtos FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON clientes FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON funcionarios FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON fornecedores FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON vendas FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON venda_itens FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON caixa_sessoes FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON caixa_movimentacoes FOR SELECT USING (true);
CREATE POLICY "Allow read for anon" ON financeiro_contas FOR SELECT USING (true);
