// ============================================
// CLICKUP VENDAS - SQLite → Supabase Sync
// ============================================
// Uso:
//   node sqlite-to-supabase.js           (uma vez)
//   node sqlite-to-supabase.js --watch   (continuo, a cada 30s)
// ============================================

import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ---- Config ----
function loadEnv() {
  const envPath = resolve(import.meta.dirname, '.env');
  if (!existsSync(envPath)) {
    console.error('Arquivo .env não encontrado. Copie .env.example para .env e configure.');
    process.exit(1);
  }
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY;
const SQLITE_PATH = process.env.SQLITE_PATH || env.SQLITE_PATH || `${process.env.APPDATA}/ClickUpVendas/teste_local.db`;
const SYNC_INTERVAL = parseInt(env.SYNC_INTERVAL || '30', 10);
const IS_WATCH = process.argv.includes('--watch');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Configure SUPABASE_URL e SUPABASE_SERVICE_KEY no .env');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- SQLite Connection ----
function getDb() {
  const db = new Database(SQLITE_PATH, { readonly: true });
  db.pragma('journal_mode = WAL');
  return db;
}

// ---- Mapeamento SQLite → Supabase ----

function syncProdutos(db) {
  const rows = db.prepare('SELECT * FROM produtos').all();
  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    nome: r.nome,
    sku: r.sku || r.codigo || `SKU-${r.id}`,
    codigo_barras: r.codigo_barras || null,
    preco_venda: r.preco_venda || 0,
    preco_custo: r.preco_custo || 0,
    estoque_atual: r.estoque_atual || 0,
    estoque_minimo: r.estoque_minimo || 0,
    unidade: r.unidade || 'UN',
    categoria: r.categoria || null,
    ncm: r.ncm || null,
    cfop: r.cfop || null,
    cst_csosn: r.cst_csosn || null,
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('produtos', data);
}

function syncClientes(db) {
  const rows = db.prepare('SELECT * FROM clientes').all();
  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    nome: r.nome,
    documento: r.cpf || r.cpf_cnpj || r.documento || '',
    email: r.email || null,
    telefone: r.telefone || null,
    endereco: r.endereco || null,
    cidade: r.cidade || null,
    uf: r.uf || null,
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('clientes', data);
}

function syncFuncionarios(db) {
  const rows = db.prepare('SELECT * FROM funcionarios').all();
  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    nome: r.nome,
    cargo: r.cargo || 'Vendedor',
    cpf: r.cpf || '',
    email: r.email || '',
    status: r.status || 'Ativo',
    comissao: r.comissao || 0,
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('funcionarios', data);
}

function syncFornecedores(db) {
  const rows = db.prepare('SELECT * FROM fornecedores').all();
  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    nome: r.nome,
    cnpj: r.cnpj || '',
    email: r.email || null,
    telefone: r.telefone || null,
    endereco: r.endereco || null,
    contato: r.contato || null,
    categoria: r.categoria || null,
    status: r.status || 'Ativo',
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('fornecedores', data);
}

function syncVendas(db) {
  const rows = db.prepare(`
    SELECT v.*,
           c.nome as cliente_nome,
           f.nome as vendedor_nome
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN funcionarios f ON v.vendedor_id = f.id
    ORDER BY v.created_at DESC
  `).all();

  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    codigo: r.codigo || r.codigo_venda || `VND-${String(r.id).slice(0, 8)}`,
    data: r.data_venda || r.created_at || new Date().toISOString(),
    cliente_nome: r.cliente_nome || r.cliente_nome_manual || 'Consumidor',
    vendedor_nome: r.vendedor_nome || 'N/D',
    total: r.valor_total || r.total || 0,
    desconto: r.desconto_total || r.desconto || 0,
    forma_pagamento: r.tipo_pagamento || r.forma_pagamento || 'N/D',
    status: r.status || 'Concluida',
    caixa_id: r.sessao_caixa_id || r.caixa_id || null,
    created_at: r.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('vendas', data);
}

function syncVendaItens(db) {
  const rows = db.prepare(`
    SELECT vi.*, v.codigo as venda_codigo
    FROM venda_itens vi
    LEFT JOIN vendas v ON vi.venda_id = v.id
  `).all();

  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    venda_id: r.venda_id,
    produto_nome: r.nome || r.produto_nome || 'Produto',
    quantidade: r.quantidade || 1,
    preco_unitario: r.preco_unitario || 0,
    subtotal: r.subtotal || 0,
    created_at: r.created_at || new Date().toISOString()
  }));

  return upsertBatch('venda_itens', data);
}

function syncCaixaSessoes(db) {
  // Tenta tabela caixa_sessoes, senão tenta caixa
  let rows = [];
  try {
    rows = db.prepare(`
      SELECT cs.*,
             f.nome as operador
      FROM caixa_sessoes cs
      LEFT JOIN funcionarios f ON cs.funcionario_id = f.id OR cs.vendedor_id = f.id
      ORDER BY cs.created_at DESC
    `).all();
  } catch {
    try {
      rows = db.prepare('SELECT * FROM caixa ORDER BY created_at DESC').all();
    } catch {
      return 0;
    }
  }

  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    data_abertura: r.aberto_em || r.data_abertura || r.created_at || new Date().toISOString(),
    data_fechamento: r.fechado_em || r.data_fechamento || null,
    saldo_inicial: r.valor_abertura || r.saldo_inicial || 0,
    saldo_final: r.valor_fechamento_esperado || r.valor_fechamento_informado || r.saldo_final || null,
    status: mapCaixaStatus(r.status),
    operador: r.operador || r.vendedor_nome || 'N/D',
    created_at: r.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('caixa_sessoes', data);
}

function syncCaixaMovimentacoes(db) {
  let rows = [];
  try {
    rows = db.prepare(`
      SELECT cm.*, cs.id as caixa_id_resolved
      FROM caixa_movimentacoes cm
      LEFT JOIN caixa_sessoes cs ON cm.sessao_caixa_id = cs.id OR cm.caixa_id = cs.id
      ORDER BY cm.created_at DESC
    `).all();
  } catch {
    try {
      rows = db.prepare('SELECT * FROM movimentacoes_caixa ORDER BY created_at DESC').all();
    } catch {
      return 0;
    }
  }

  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    caixa_id: r.caixa_id_resolved || r.caixa_id || r.sessao_caixa_id || null,
    tipo: r.tipo || 'Outros',
    descricao: r.descricao || r.motivo || '',
    valor: r.valor || 0,
    forma_pagamento: r.forma_pagamento || null,
    data: r.data || r.created_at || new Date().toISOString(),
    operador: r.operador || 'N/D',
    created_at: r.created_at || new Date().toISOString()
  }));

  return upsertBatch('caixa_movimentacoes', data);
}

function syncFinanceiro(db) {
  const rows = db.prepare('SELECT * FROM financeiro_contas ORDER BY created_at DESC').all();
  if (rows.length === 0) return 0;

  const data = rows.map(r => ({
    id: r.id,
    descricao: r.descricao || '',
    tipo: r.tipo || 'Despesa',
    categoria: r.categoria || null,
    valor: r.valor || 0,
    data_vencimento: r.vencimento || r.data_vencimento || new Date().toISOString(),
    data_pagamento: r.data_pagamento || null,
    status: r.status || 'Pendente',
    pessoa: r.fornecedor_ou_cliente || r.pessoa || null,
    created_at: r.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return upsertBatch('financeiro_contas', data);
}

// ---- Helpers ----

function mapCaixaStatus(status) {
  if (!status) return 'Aberto';
  const s = status.toLowerCase();
  if (s === 'aberto' || s === 'open') return 'Aberto';
  if (s === 'fechado' || s === 'closed') return 'Fechado';
  return status;
}

async function upsertBatch(table, data) {
  const BATCH_SIZE = 500;
  let total = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    const { error } = await sb
      .from(table)
      .upsert(batch, { onConflict: 'id', ignoreDuplicates: false });

    if (error) {
      console.error(`  Erro ao upsert ${table} (batch ${Math.floor(i / BATCH_SIZE) + 1}):`, error.message);
    } else {
      total += batch.length;
    }
  }

  return total;
}

// ---- Sync Principal ----

async function syncAll() {
  const startTime = Date.now();
  console.log(`\n[${new Date().toLocaleString('pt-BR')}] Iniciando sincronização...`);

  let db;
  try {
    db = getDb();
  } catch (err) {
    console.error(`  Erro ao abrir SQLite: ${SQLITE_PATH}`);
    console.error(`  ${err.message}`);
    return;
  }

  const syncs = [
    { name: 'Produtos', fn: () => syncProdutos(db) },
    { name: 'Clientes', fn: () => syncClientes(db) },
    { name: 'Funcionários', fn: () => syncFuncionarios(db) },
    { name: 'Fornecedores', fn: () => syncFornecedores(db) },
    { name: 'Vendas', fn: () => syncVendas(db) },
    { name: 'Venda Itens', fn: () => syncVendaItens(db) },
    { name: 'Caixa Sessões', fn: () => syncCaixaSessoes(db) },
    { name: 'Caixa Movimentações', fn: () => syncCaixaMovimentacoes(db) },
    { name: 'Financeiro', fn: () => syncFinanceiro(db) },
  ];

  let totalRegistros = 0;

  for (const sync of syncs) {
    try {
      const count = sync.fn();
      totalRegistros += count;
      console.log(`  ✓ ${sync.name}: ${count} registros`);
    } catch (err) {
      console.error(`  ✗ ${sync.name}: ${err.message}`);
    }
  }

  db.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  Total: ${totalRegistros} registros em ${elapsed}s`);
  console.log(`[${new Date().toLocaleString('pt-BR')}] Sincronização concluída.\n`);
}

// ---- Main ----

async function main() {
  console.log('ClickUp Vendas - SQLite → Supabase Sync');
  console.log(`SQLite: ${SQLITE_PATH}`);
  console.log(`Supabase: ${SUPABASE_URL}`);

  if (!existsSync(SQLITE_PATH)) {
    console.error(`\nBanco SQLite não encontrado: ${SQLITE_PATH}`);
    console.error('Verifique o caminho no arquivo .env');
    process.exit(1);
  }

  await syncAll();

  if (IS_WATCH) {
    console.log(`Modo watch: sincronizando a cada ${SYNC_INTERVAL}s...\n`);
    setInterval(syncAll, SYNC_INTERVAL * 1000);
  }
}

main();
