import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Loja {
  id: string
  nome: string
  supabaseUrl: string
  supabaseKey: string
  ativa: boolean
}

const LOJAS_KEY = 'clickup_lojas'
const LOJA_ATIVA_KEY = 'clickup_loja_ativa'

export function obterLojas(): Loja[] {
  try {
    const raw = localStorage.getItem(LOJAS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function salvarLojas(lojas: Loja[]) {
  localStorage.setItem(LOJAS_KEY, JSON.stringify(lojas))
}

export function obterLojaAtiva(): Loja | null {
  const lojas = obterLojas()
  const id = localStorage.getItem(LOJA_ATIVA_KEY)
  if (id) {
    const found = lojas.find((l) => l.id === id && l.ativa)
    if (found) return found
  }
  return lojas.find((l) => l.ativa) || lojas[0] || null
}

export function selecionarLoja(id: string) {
  localStorage.setItem(LOJA_ATIVA_KEY, id)
}

let clientCache: { id: string; client: SupabaseClient } | null = null

export function getSupabaseClient(loja?: Loja | null): SupabaseClient | null {
  const l = loja || obterLojaAtiva()
  if (!l) return null
  if (clientCache && clientCache.id === l.id) return clientCache.client
  const client = createClient(l.supabaseUrl, l.supabaseKey, {
    auth: { persistSession: false },
  })
  clientCache = { id: l.id, client }
  return client
}

export function limparCacheClient() {
  clientCache = null
}
