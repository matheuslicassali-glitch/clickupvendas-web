import { useEffect, useState } from 'react'
import { Eye, X, Search, Hash } from 'lucide-react'
import { listarVendas, type Venda } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Vendas() {
  const { lojaAtiva } = useStore()
  const [vendas, setVendas] = useState<Venda[]>([])
  const [filtro, setFiltro] = useState('')
  const [showDetail, setShowDetail] = useState<Venda | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadVendas() }, [lojaAtiva?.id])

  async function loadVendas() {
    setLoading(true)
    try {
      const res = await listarVendas()
      setVendas(res.data)
    } catch (err) { console.error('Erro ao carregar vendas:', err) } finally { setLoading(false) }
  }

  const vendasFiltradas = vendas.filter((v) => {
    if (!filtro) return true
    const f = filtro.toLowerCase()
    return String(v.ID).includes(f) || v.Cliente?.Nome?.toLowerCase().includes(f) || v.FormaPagamento?.toLowerCase().includes(f)
  })

  const totalVendas = vendasFiltradas.reduce((a, v) => a + (v.ValorTotal || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Vendas</h1>
          <p className="page-subtitle">Historico completo de vendas realizadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card stat-card-blue">
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total de Vendas</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{vendasFiltradas.length}</p>
        </div>
        <div className="stat-card stat-card-green">
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Faturamento Total</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--accent-green)' }}>R$ {totalVendas.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-card-purple">
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Ticket Medio</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>
            R$ {vendasFiltradas.length > 0 ? (totalVendas / vendasFiltradas.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          placeholder="Buscar por ID, cliente ou forma de pagamento..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="gradient-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Pagamento</th>
                <th>Valor</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map((venda, i) => (
                <tr key={venda.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td>
                    <span className="font-mono text-[13px] font-semibold" style={{ color: 'var(--accent-blue-light)' }}>#{venda.ID}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(venda.DataVenda).toLocaleDateString('pt-BR')}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{venda.Cliente?.Nome || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{venda.Vendedor || '-'}</td>
                  <td><span className="badge badge-info">{venda.FormaPagamento}</span></td>
                  <td><span className="font-bold" style={{ color: 'var(--accent-green)' }}>R$ {(venda.ValorTotal || 0).toFixed(2)}</span></td>
                  <td>
                    <span className={`badge ${venda.Status === 'concluida' ? 'badge-success' : venda.Status === 'cancelada' ? 'badge-danger' : 'badge-warning'}`}>
                      {venda.Status === 'concluida' ? 'Concluida' : venda.Status === 'cancelada' ? 'Cancelada' : venda.Status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => setShowDetail(venda)} className="p-2 rounded-lg hover:bg-[#f0f2f5] transition-colors" style={{ color: 'var(--accent-blue)' }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDetail(null)}>
          <div className="gradient-card w-full max-w-lg mx-4 p-6 shadow-2xl" style={{ animation: 'fadeIn 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-blue)' }}>
                  <Hash size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>Venda #{showDetail.ID}</h3>
                  <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{new Date(showDetail.DataVenda).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 rounded-lg hover:bg-[#f0f2f5]" style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <div className="detail-row"><span className="detail-label">Cliente</span><span className="detail-value">{showDetail.Cliente?.Nome || '-'}</span></div>
              <div className="detail-row"><span className="detail-label">Vendedor</span><span className="detail-value">{showDetail.Vendedor || '-'}</span></div>
              <div className="detail-row"><span className="detail-label">Pagamento</span><span className="detail-value"><span className="badge badge-info">{showDetail.FormaPagamento}</span></span></div>
              <div className="detail-row"><span className="detail-label">Desconto</span><span className="detail-value">R$ {(showDetail.Desconto || 0).toFixed(2)}</span></div>
              <div className="detail-row"><span className="detail-label">Acrescimo</span><span className="detail-value">R$ {(showDetail.Acrescimo || 0).toFixed(2)}</span></div>
              <div className="detail-row" style={{ borderBottom: 'none' }}>
                <span className="detail-label font-semibold">Total</span>
                <span className="text-[18px] font-bold" style={{ color: 'var(--accent-green)' }}>R$ {(showDetail.ValorTotal || 0).toFixed(2)}</span>
              </div>
            </div>

            {showDetail.Itens && showDetail.Itens.length > 0 && (
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Itens da Venda</p>
                <div className="space-y-2">
                  {showDetail.Itens.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                      <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>{item.Produto?.Nome || `Produto #${item.ProdutoID}`}</span>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{item.Quantidade}x R$ {(item.PrecoUnitario || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
