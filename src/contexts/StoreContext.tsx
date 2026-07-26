import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  obterLojas,
  obterLojaAtiva,
  selecionarLoja,
  salvarLojas,
  limparCacheClient,
  type Loja,
} from '../lib/supabase'

interface StoreContextType {
  lojas: Loja[]
  lojaAtiva: Loja | null
  loading: boolean
  selecionar: (id: string) => void
  adicionar: (loja: Omit<Loja, 'id' | 'ativa'>) => Loja
  remover: (id: string) => void
  atualizar: (id: string, dados: Partial<Loja>) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [lojaAtiva, setLojaAtiva] = useState<Loja | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const l = obterLojas()
    setLojas(l)
    setLojaAtiva(obterLojaAtiva())
    setLoading(false)
  }, [])

  const selecionar = useCallback((id: string) => {
    selecionarLoja(id)
    limparCacheClient()
    setLojaAtiva(obterLojaAtiva())
  }, [])

  const adicionar = useCallback((dados: Omit<Loja, 'id' | 'ativa'>) => {
    const nova: Loja = {
      ...dados,
      id: crypto.randomUUID(),
      ativa: true,
    }
    const atualizadas = [...lojas, nova]
    salvarLojas(atualizadas)
    setLojas(atualizadas)
    if (!lojaAtiva) {
      selecionar(nova.id)
    }
    return nova
  }, [lojas, lojaAtiva, selecionar])

  const remover = useCallback((id: string) => {
    const atualizadas = lojas.filter((l) => l.id !== id)
    salvarLojas(atualizadas)
    setLojas(atualizadas)
    if (lojaAtiva?.id === id) {
      limparCacheClient()
      setLojaAtiva(atualizadas[0] || null)
      if (atualizadas[0]) selecionarLoja(atualizadas[0].id)
    }
  }, [lojas, lojaAtiva])

  const atualizar = useCallback((id: string, dados: Partial<Loja>) => {
    const atualizadas = lojas.map((l) => l.id === id ? { ...l, ...dados } : l)
    salvarLojas(atualizadas)
    setLojas(atualizadas)
    if (lojaAtiva?.id === id) {
      limparCacheClient()
      setLojaAtiva(obterLojaAtiva())
    }
  }, [lojas, lojaAtiva])

  return (
    <StoreContext.Provider value={{ lojas, lojaAtiva, loading, selecionar, adicionar, remover, atualizar }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
