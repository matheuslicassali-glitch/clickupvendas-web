import { useEffect, useState } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'
import { listarProdutos, listarMovimentacoesEstoque, type Produto, type MovimentacaoEstoque } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Estoque() {
  const { lojaAtiva } = useStore()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [tab, setTab] = useState<'produtos' | 'movimentacoes'>('produtos')
  const [filtro, setFiltro] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadData(); else setLoading(false) }, [lojaAtiva?.id])

  async function loadData() {
    setLoading(true)
    try {
      const [pRes, mRes] = await Promise.all([listarProdutos(), listarMovimentacoesEstoque()])
      setProdutos(pRes.data)
      setMovimentacoes(mRes.data)
    } catch (err) { console.error('Erro ao carregar estoque:', err) } finally { setLoading(false) }
  }

  const produtosFiltrados = produtos.filter((p) => {
    const f = filtro.toLowerCase()
    return p.Nome?.toLowerCase().includes(f) || p.CodigoBarras?.toLowerCase().includes(f) || p.Marca?.toLowerCase().includes(f)
  })

  const movFiltradas = movimentacoes.filter((m) => {
    if (filtroTipo && m.Tipo !== filtroTipo) return false
    if (filtro) {
      const f = filtro.toLowerCase()
      return m.Produto?.Nome?.toLowerCase().includes(f) || m.Descricao?.toLowerCase().includes(f)
    }
    return true
  })

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Estoque</h1>
          <p className="page-subtitle">Controle de produtos e movimentacoes</p>
        </div>
      </div>

      <div className="filter-tabs">
        {[
          { key: 'produtos' as const, label: 'Produtos', count: produtos.length },
          { key: 'movimentacoes' as const, label: 'Movimentacoes', count: movimentacoes.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`filter-tab ${tab === t.key ? 'active' : ''}`}
          >
            {t.label}
            <span className="filter-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Buscar produtos..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="search-input" />
        </div>
        {tab === 'movimentacoes' && (
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2.5 text-[13px] font-medium"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius)' }}
          >
            <option value="">Todos Tipos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saida</option>
            <option value="venda">Venda</option>
            <option value="ajuste">Ajuste</option>
          </select>
        )}
      </div>

      {tab === 'produtos' && (
        <div className="gradient-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-modern">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Codigo</th>
                  <th>Marca</th>
                  <th>Preco</th>
                  <th>Estoque</th>
                  <th>Minimo</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((p, i) => (
                  <tr key={p.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.Nome}</td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{p.CodigoBarras || '-'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.Marca || '-'}</td>
                    <td><span className="font-bold" style={{ color: 'var(--text-primary)' }}>R$ {(p.Preco || 0).toFixed(2)}</span></td>
                    <td>
                      <span className={`badge ${(p.Estoque || 0) <= 0 ? 'badge-danger' : (p.Estoque || 0) <= (p.EstoqueMinimo || 5) ? 'badge-warning' : 'badge-success'}`}>
                        {p.Estoque || 0} {p.Unidade || 'un'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.EstoqueMinimo || 5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'movimentacoes' && (
        <div className="gradient-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-modern">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Descricao</th>
                </tr>
              </thead>
              <tbody>
                {movFiltradas.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Nenhuma movimentacao encontrada</td></tr>
                ) : (
                  movFiltradas.map((m, i) => (
                    <tr key={m.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(m.Data).toLocaleString('pt-BR')}</td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.Produto?.Nome || `Produto #${m.ProdutoID}`}</td>
                      <td>
                        <span className={`badge ${m.Tipo === 'entrada' ? 'badge-success' : m.Tipo === 'saida' || m.Tipo === 'venda' ? 'badge-danger' : 'badge-info'}`}>
                          {m.Tipo === 'entrada' ? 'Entrada' : m.Tipo === 'saida' ? 'Saida' : m.Tipo === 'venda' ? 'Venda' : 'Ajuste'}
                        </span>
                      </td>
                      <td>
                        <span className="flex items-center gap-1 font-bold" style={{ color: m.Tipo === 'entrada' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                          {m.Tipo === 'entrada' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {m.Tipo === 'entrada' ? '+' : '-'}{m.Quantidade}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{m.Descricao || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
