import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react'
import { listarContas, type ContaFinanceira } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Financeiro() {
  const { lojaAtiva } = useStore()
  const [contas, setContas] = useState<ContaFinanceira[]>([])
  const [filtro, setFiltro] = useState<string>('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadContas(); else setLoading(false) }, [lojaAtiva?.id])

  async function loadContas() {
    setLoading(true)
    try {
      const res = await listarContas()
      setContas(res.data)
    } catch (err) { console.error('Erro ao carregar contas:', err) } finally { setLoading(false) }
  }

  const contasFiltradas = contas.filter((c) => filtro === 'todos' || c.Status === filtro)
  const totalReceitas = contas.filter((c) => c.Tipo === 'receita' && c.Status === 'pago').reduce((a, c) => a + (c.Valor || 0), 0)
  const totalDespesas = contas.filter((c) => c.Tipo === 'despesa' && c.Status === 'pago').reduce((a, c) => a + (c.Valor || 0), 0)
  const totalPendente = contas.filter((c) => c.Status === 'pendente').reduce((a, c) => a + (c.Valor || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Financeiro</h1>
          <p className="page-subtitle">Controle de receitas, despesas e contas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card stat-card-green">
          <div className="flex items-start justify-between mb-3">
            <div className="icon-box" style={{ background: 'var(--gradient-green)' }}><TrendingUp size={20} className="text-white" /></div>
          </div>
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Receitas Pagas</p>
          <p className="text-[22px] font-bold" style={{ color: 'var(--accent-green)' }}>R$ {totalReceitas.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-card-red">
          <div className="flex items-start justify-between mb-3">
            <div className="icon-box" style={{ background: 'var(--gradient-red)' }}><TrendingDown size={20} className="text-white" /></div>
          </div>
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Despesas Pagas</p>
          <p className="text-[22px] font-bold" style={{ color: 'var(--accent-red)' }}>R$ {totalDespesas.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-card-amber">
          <div className="flex items-start justify-between mb-3">
            <div className="icon-box" style={{ background: 'var(--gradient-amber)' }}><Clock size={20} className="text-white" /></div>
          </div>
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Pendentes</p>
          <p className="text-[22px] font-bold" style={{ color: 'var(--accent-amber)' }}>R$ {totalPendente.toFixed(2)}</p>
        </div>
      </div>

      <div className="filter-tabs">
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'pendente', label: 'Pendentes' },
          { key: 'pago', label: 'Pagos' },
          { key: 'atrasado', label: 'Atrasados' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`filter-tab ${filtro === f.key ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="gradient-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-modern">
            <thead>
              <tr>
                <th>Descricao</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contasFiltradas.map((conta, i) => (
                <tr key={conta.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{conta.Descricao}</td>
                  <td>
                    <span className={`badge ${conta.Tipo === 'receita' ? 'badge-success' : 'badge-danger'}`}>
                      {conta.Tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td><span className="font-bold" style={{ color: 'var(--text-primary)' }}>R$ {(conta.Valor || 0).toFixed(2)}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{conta.DataVencimento ? new Date(conta.DataVencimento).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <span className={`badge ${conta.Status === 'pago' ? 'badge-success' : conta.Status === 'atrasado' ? 'badge-danger' : 'badge-warning'}`}>
                      {conta.Status === 'pago' ? 'Pago' : conta.Status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
