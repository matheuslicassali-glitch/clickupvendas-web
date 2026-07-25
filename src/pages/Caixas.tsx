import { useEffect, useState } from 'react'
import { Wallet, ChevronDown, ChevronUp } from 'lucide-react'
import { listarHistoricoCaixa, listarMovimentacoesCaixa, type CaixaSessao, type CaixaMovimentacao } from '../api'

export default function Caixas() {
  const [sessoes, setSessoes] = useState<CaixaSessao[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [movimentacoes, setMovimentacoes] = useState<CaixaMovimentacao[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMovs, setLoadingMovs] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const res = await listarHistoricoCaixa()
      setSessoes(res.data)
    } catch (err) {
      console.error('Erro ao carregar caixas:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null)
      setMovimentacoes([])
      return
    }
    setExpandedId(id)
    setLoadingMovs(true)
    try {
      const res = await listarMovimentacoesCaixa(id)
      setMovimentacoes(res.data)
    } catch (err) {
      console.error('Erro ao carregar movimentacoes:', err)
    } finally {
      setLoadingMovs(false)
    }
  }

  function formatCurrency(v: number) {
    return `R$ ${(v || 0).toFixed(2)}`
  }

  function getMovimentacaoTotal(movs: CaixaMovimentacao[], tipo: string) {
    return movs.filter((m) => m.Tipo === tipo).reduce((a, m) => a + (m.Valor || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet size={24} style={{ color: 'var(--primary)' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Historico de Caixas</h2>
      </div>

      {sessoes.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Wallet size={48} className="mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
          <p style={{ color: 'var(--muted-foreground)' }}>Nenhuma sessao de caixa encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessoes.map((sessao) => (
            <div
              key={sessao.ID}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:opacity-90"
                onClick={() => toggleExpand(sessao.ID)}
                style={{ background: sessao.Status === 'aberto' ? '#f0fdf4' : 'var(--card)' }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Caixa #{sessao.ID}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Aberto: {new Date(sessao.DataAbertura).toLocaleString('pt-BR')}
                      {sessao.DataFechamento && (
                        <> | Fechado: {new Date(sessao.DataFechamento).toLocaleString('pt-BR')}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: sessao.Status === 'aberto' ? '#dcfce7' : '#f1f5f9',
                      color: sessao.Status === 'aberto' ? '#166534' : '#64748b',
                    }}
                  >
                    {sessao.Status === 'aberto' ? 'Aberto' : 'Fechado'}
                  </span>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Abertura</p>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(sessao.ValorAbertura)}</p>
                  </div>
                  {sessao.ValorFechamento != null && (
                    <div className="text-right">
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Fechamento</p>
                      <p className="font-bold" style={{ color: sessao.ValorFechamento >= sessao.ValorAbertura ? '#22c55e' : '#ef4444' }}>
                        {formatCurrency(sessao.ValorFechamento)}
                      </p>
                    </div>
                  )}
                  {expandedId === sessao.ID ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Movimentacoes */}
              {expandedId === sessao.ID && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {loadingMovs ? (
                    <div className="p-4 text-center" style={{ color: 'var(--muted-foreground)' }}>Carregando movimentacoes...</div>
                  ) : movimentacoes.length === 0 ? (
                    <div className="p-4 text-center" style={{ color: 'var(--muted-foreground)' }}>Nenhuma movimentacao</div>
                  ) : (
                    <div className="p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="p-3 rounded-lg" style={{ background: '#dcfce7' }}>
                          <p className="text-xs" style={{ color: '#166534' }}>Entradas</p>
                          <p className="font-bold" style={{ color: '#166534' }}>
                            {formatCurrency(getMovimentacaoTotal(movimentacoes, 'entrada'))}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: '#fef2f2' }}>
                          <p className="text-xs" style={{ color: '#991b1b' }}>Saidas</p>
                          <p className="font-bold" style={{ color: '#991b1b' }}>
                            {formatCurrency(getMovimentacaoTotal(movimentacoes, 'saida'))}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: '#eff6ff' }}>
                          <p className="text-xs" style={{ color: '#1e40af' }}>Suprimento</p>
                          <p className="font-bold" style={{ color: '#1e40af' }}>
                            {formatCurrency(getMovimentacaoTotal(movimentacoes, 'suprimento'))}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: '#fffbeb' }}>
                          <p className="text-xs" style={{ color: '#92400e' }}>Sangria</p>
                          <p className="font-bold" style={{ color: '#92400e' }}>
                            {formatCurrency(getMovimentacaoTotal(movimentacoes, 'sangria'))}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {movimentacoes.map((mov) => (
                          <div
                            key={mov.ID}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ background: 'var(--muted)' }}
                          >
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{mov.Descricao}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                {new Date(mov.Data).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className="text-sm font-bold"
                                style={{
                                  color: ['entrada', 'suprimento'].includes(mov.Tipo) ? '#22c55e' : '#ef4444',
                                }}
                              >
                                {['entrada', 'suprimento'].includes(mov.Tipo) ? '+' : '-'}
                                {formatCurrency(mov.Valor)}
                              </span>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mov.Tipo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
