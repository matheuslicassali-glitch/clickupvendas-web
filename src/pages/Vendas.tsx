import { useEffect, useState } from 'react'
import { Eye, XCircle, Search } from 'lucide-react'
import { listarVendas, cancelarVenda, type Venda } from '../api'

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [filtro, setFiltro] = useState('')
  const [showDetail, setShowDetail] = useState<Venda | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadVendas() }, [])

  async function loadVendas() {
    try {
      const res = await listarVendas()
      setVendas(res.data)
    } catch (err) {
      console.error('Erro ao carregar vendas:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(id: number) {
    if (!confirm('Tem certeza que deseja cancelar esta venda?')) return
    try {
      await cancelarVenda(id)
      loadVendas()
      setShowDetail(null)
    } catch (err) {
      console.error('Erro ao cancelar venda:', err)
    }
  }

  const vendasFiltradas = vendas.filter((v) => {
    if (!filtro) return true
    const f = filtro.toLowerCase()
    return (
      String(v.ID).includes(f) ||
      v.Cliente?.Nome?.toLowerCase().includes(f) ||
      v.FormaPagamento?.toLowerCase().includes(f)
    )
  })

  const totalVendas = vendasFiltradas.reduce((a, v) => a + (v.ValorTotal || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total de Vendas</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{vendasFiltradas.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Faturamento Total</p>
          <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>R$ {totalVendas.toFixed(2)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ticket Medio</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            R$ {vendasFiltradas.length > 0 ? (totalVendas / vendasFiltradas.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input
          placeholder="Buscar por ID, cliente ou forma de pagamento..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>ID</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Data</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Cliente</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Vendedor</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Pagamento</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Valor</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                <th className="text-right p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map((venda) => (
                <tr key={venda.ID} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>#{venda.ID}</td>
                  <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>
                    {new Date(venda.DataVenda).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{venda.Cliente?.Nome || '-'}</td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{venda.Vendedor || '-'}</td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{venda.FormaPagamento}</td>
                  <td className="p-3 font-bold" style={{ color: '#22c55e' }}>R$ {(venda.ValorTotal || 0).toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        background: venda.Status === 'concluida' ? '#dcfce7' : venda.Status === 'cancelada' ? '#fef2f2' : '#fffbeb',
                        color: venda.Status === 'concluida' ? '#166534' : venda.Status === 'cancelada' ? '#991b1b' : '#92400e',
                      }}
                    >
                      {venda.Status === 'concluida' ? 'Concluida' : venda.Status === 'cancelada' ? 'Cancelada' : venda.Status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setShowDetail(venda)} className="p-1 rounded hover:opacity-80" style={{ color: 'var(--primary)' }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl p-6 w-full max-w-lg shadow-xl" style={{ background: 'var(--card)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Venda #{showDetail.ID}</h3>
              <button onClick={() => setShowDetail(null)} style={{ color: 'var(--muted-foreground)' }}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Data</span>
                <span style={{ color: 'var(--foreground)' }}>{new Date(showDetail.DataVenda).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Cliente</span>
                <span style={{ color: 'var(--foreground)' }}>{showDetail.Cliente?.Nome || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Vendedor</span>
                <span style={{ color: 'var(--foreground)' }}>{showDetail.Vendedor || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Pagamento</span>
                <span style={{ color: 'var(--foreground)' }}>{showDetail.FormaPagamento}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Desconto</span>
                <span style={{ color: 'var(--foreground)' }}>R$ {(showDetail.Desconto || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Acrescimo</span>
                <span style={{ color: 'var(--foreground)' }}>R$ {(showDetail.Acrescimo || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base" style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                <span style={{ color: 'var(--foreground)' }}>Total</span>
                <span style={{ color: '#22c55e' }}>R$ {(showDetail.ValorTotal || 0).toFixed(2)}</span>
              </div>

              {showDetail.Itens && showDetail.Itens.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>Itens</p>
                  <div className="space-y-2">
                    {showDetail.Itens.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 rounded" style={{ background: 'var(--muted)' }}>
                        <span style={{ color: 'var(--foreground)' }}>{item.Produto?.Nome || `Produto #${item.ProdutoID}`}</span>
                        <span style={{ color: 'var(--foreground)' }}>{item.Quantidade}x R$ {(item.PrecoUnitario || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {showDetail.Status !== 'cancelada' && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handleCancel(showDetail.ID)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#ef4444' }}
                >
                  <XCircle size={16} /> Cancelar Venda
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
