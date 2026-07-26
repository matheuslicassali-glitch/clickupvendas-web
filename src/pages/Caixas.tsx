import { useEffect, useState } from 'react'
import { Wallet, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'
import { listarHistoricoCaixa, listarMovimentacoesCaixa, type CaixaSessao, type CaixaMovimentacao } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Caixas() {
  const { lojaAtiva } = useStore()
  const [sessoes, setSessoes] = useState<CaixaSessao[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [movimentacoes, setMovimentacoes] = useState<CaixaMovimentacao[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMovs, setLoadingMovs] = useState(false)

  useEffect(() => { if (lojaAtiva) loadData() }, [lojaAtiva?.id])

  async function loadData() {
    setLoading(true)
    try { const res = await listarHistoricoCaixa(); setSessoes(res.data) } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function toggleExpand(id: number) {
    if (expandedId === id) { setExpandedId(null); setMovimentacoes([]); return }
    setExpandedId(id)
    setLoadingMovs(true)
    try { const res = await listarMovimentacoesCaixa(id); setMovimentacoes(res.data) } catch (err) { console.error(err) } finally { setLoadingMovs(false) }
  }

  function formatCurrency(v: number) { return `R$ ${(v || 0).toFixed(2)}` }
  function getMovimentacaoTotal(movs: CaixaMovimentacao[], tipo: string) { return movs.filter((m) => m.Tipo === tipo).reduce((a, m) => a + (m.Valor || 0), 0) }

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Caixas</h1>
        <p className="page-subtitle">Historico de sessoes de caixa</p>
      </div>

      {sessoes.length === 0 ? (
        <div className="gradient-card">
          <div className="empty-state py-16">
            <Wallet size={48} style={{ color: 'var(--text-muted)', opacity: 0.2 }} />
            <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>Nenhuma sessao de caixa encontrada</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sessoes.map((sessao, i) => (
            <div key={sessao.ID} className="gradient-card overflow-hidden" style={{ animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}>
              <div
                className="flex items-center justify-between p-5 cursor-pointer transition-all duration-200 hover:bg-white/[0.02]"
                onClick={() => toggleExpand(sessao.ID)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: sessao.Status === 'aberto' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.12)' }}>
                    <Wallet size={20} style={{ color: sessao.Status === 'aberto' ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Caixa #{sessao.ID}</p>
                    <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      Aberto: {new Date(sessao.DataAbertura).toLocaleString('pt-BR')}
                      {sessao.DataFechamento && <> | Fechado: {new Date(sessao.DataFechamento).toLocaleString('pt-BR')}</>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className={`badge ${sessao.Status === 'aberto' ? 'badge-success' : 'badge-info'}`}>
                    {sessao.Status === 'aberto' ? 'Aberto' : 'Fechado'}
                  </span>
                  <div className="text-right">
                    <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Abertura</p>
                    <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(sessao.ValorAbertura)}</p>
                  </div>
                  {sessao.ValorFechamento != null && (
                    <div className="text-right">
                      <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Fechamento</p>
                      <p className="text-[15px] font-bold" style={{ color: sessao.ValorFechamento >= sessao.ValorAbertura ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {formatCurrency(sessao.ValorFechamento)}
                      </p>
                    </div>
                  )}
                  {expandedId === sessao.ID ? <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </div>

              {expandedId === sessao.ID && (
                <div style={{ borderTop: '1px solid var(--border-color)' }} className="p-5">
                  {loadingMovs ? (
                    <div className="flex justify-center py-6"><div className="loading-spinner" /></div>
                  ) : movimentacoes.length === 0 ? (
                    <p className="text-center py-6 text-[13px]" style={{ color: 'var(--text-muted)' }}>Nenhuma movimentacao</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--accent-green)' }}>Entradas</p>
                          <p className="text-[16px] font-bold mt-1" style={{ color: 'var(--accent-green)' }}>{formatCurrency(getMovimentacaoTotal(movimentacoes, 'entrada'))}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--accent-red)' }}>Saidas</p>
                          <p className="text-[16px] font-bold mt-1" style={{ color: 'var(--accent-red)' }}>{formatCurrency(getMovimentacaoTotal(movimentacoes, 'saida'))}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--accent-blue)' }}>Suprimento</p>
                          <p className="text-[16px] font-bold mt-1" style={{ color: 'var(--accent-blue)' }}>{formatCurrency(getMovimentacaoTotal(movimentacoes, 'suprimento'))}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                          <p className="text-[11px] font-medium" style={{ color: 'var(--accent-amber)' }}>Sangria</p>
                          <p className="text-[16px] font-bold mt-1" style={{ color: 'var(--accent-amber)' }}>{formatCurrency(getMovimentacaoTotal(movimentacoes, 'sangria'))}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {movimentacoes.map((mov) => (
                          <div key={mov.ID} className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/[0.02]" style={{ background: 'var(--bg-surface)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ['entrada', 'suprimento'].includes(mov.Tipo) ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' }}>
                                {['entrada', 'suprimento'].includes(mov.Tipo) ? <Plus size={14} style={{ color: 'var(--accent-green)' }} /> : <Minus size={14} style={{ color: 'var(--accent-red)' }} />}
                              </div>
                              <div>
                                <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{mov.Descricao}</p>
                                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{new Date(mov.Data).toLocaleString('pt-BR')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[14px] font-bold" style={{ color: ['entrada', 'suprimento'].includes(mov.Tipo) ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                {['entrada', 'suprimento'].includes(mov.Tipo) ? '+' : '-'}{formatCurrency(mov.Valor)}
                              </span>
                              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{mov.Tipo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
