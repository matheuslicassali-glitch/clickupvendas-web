import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { listarVendas, relatorioEstoque, relatorioContador, type Venda, type RelatorioEstoque, type RelatorioContadorItem } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

type RelatorioTipo = 'vendas' | 'estoque' | 'contador'

export default function Relatorios() {
  const { lojaAtiva } = useStore()
  const [tipo, setTipo] = useState<RelatorioTipo>('vendas')
  const [periodo, setPeriodo] = useState('mes')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [vendas, setVendas] = useState<Venda[]>([])
  const [estoque, setEstoque] = useState<RelatorioEstoque[]>([])
  const [contador, setContador] = useState<RelatorioContadorItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hoje = new Date()
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    setDataInicio(inicio.toISOString().split('T')[0])
    setDataFim(hoje.toISOString().split('T')[0])
  }, [])

  useEffect(() => { if (lojaAtiva) loadReport() }, [tipo, periodo, dataInicio, dataFim, lojaAtiva?.id])

  async function loadReport() {
    setLoading(true)
    try {
      if (tipo === 'vendas') { const res = await listarVendas(); setVendas(res.data) }
      else if (tipo === 'estoque') { const res = await relatorioEstoque(periodo); setEstoque(res.data) }
      else if (tipo === 'contador' && dataInicio && dataFim) { const res = await relatorioContador({ data_inicio: dataInicio, data_fim: dataFim }); setContador(res.data) }
    } catch (err) { console.error('Erro ao carregar relatorio:', err) } finally { setLoading(false) }
  }

  function getVendasPorDia() {
    const map: Record<string, { vendas: number; valor: number }> = {}
    vendas.forEach((v) => {
      const dia = new Date(v.DataVenda).toLocaleDateString('pt-BR')
      if (!map[dia]) map[dia] = { vendas: 0, valor: 0 }
      map[dia].vendas++
      map[dia].valor += v.ValorTotal || 0
    })
    return Object.entries(map).map(([dia, data]) => ({ name: dia, vendas: data.vendas, valor: data.valor }))
  }

  function getVendasPorPagamento() {
    const map: Record<string, number> = {}
    vendas.forEach((v) => { const fp = v.FormaPagamento || 'Outro'; map[fp] = (map[fp] || 0) + (v.ValorTotal || 0) })
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
  }

  const vendasPorDia = getVendasPorDia()
  const vendasPorPagamento = getVendasPorPagamento()
  const totalVendasPeriodo = vendas.reduce((a, v) => a + (v.ValorTotal || 0), 0)
  const totalEstoqueItens = estoque.reduce((a, e) => a + e.Entradas, 0)
  const totalEstoqueSaidas = estoque.reduce((a, e) => a + e.Saidas, 0)

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Relatorios</h1>
        <p className="page-subtitle">Analises e graficos do seu negocio</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'vendas' as const, label: 'Vendas' },
          { key: 'estoque' as const, label: 'Estoque' },
          { key: 'contador' as const, label: 'Contabil' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTipo(t.key)} className="px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200" style={{
            background: tipo === t.key ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
            color: tipo === t.key ? 'var(--accent-blue-light)' : 'var(--text-muted)',
            border: `1px solid ${tipo === t.key ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}`,
          }}>{t.label}</button>
        ))}
      </div>

      {tipo === 'vendas' && (
        <div className="flex items-center gap-3">
          <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
          {['dia', 'semana', 'mes'].map((p) => (
            <button key={p} onClick={() => setPeriodo(p)} className="px-4 py-2 rounded-xl text-[12px] font-medium transition-all" style={{
              background: periodo === p ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
              color: periodo === p ? 'var(--accent-blue-light)' : 'var(--text-muted)',
              border: `1px solid ${periodo === p ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}`,
            }}>{p === 'dia' ? 'Dia' : p === 'semana' ? 'Semana' : 'Mes'}</button>
          ))}
        </div>
      )}

      {tipo === 'contador' && (
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Inicio</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="search-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Fim</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="search-input" style={{ paddingLeft: '16px' }} />
          </div>
        </div>
      )}

      {tipo === 'vendas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card stat-card-blue">
              <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Vendas</p>
              <p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{vendas.length}</p>
            </div>
            <div className="stat-card stat-card-green">
              <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Faturamento</p>
              <p className="text-[24px] font-bold" style={{ color: 'var(--accent-green)' }}>R$ {totalVendasPeriodo.toFixed(2)}</p>
            </div>
            <div className="stat-card stat-card-purple">
              <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Ticket Medio</p>
              <p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>R$ {vendas.length > 0 ? (totalVendasPeriodo / vendas.length).toFixed(2) : '0.00'}</p>
            </div>
          </div>

          {vendasPorDia.length > 0 && (
            <div className="gradient-card p-5">
              <h3 className="section-title">Vendas por Dia</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={vendasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }} formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']} />
                  <Bar dataKey="valor" fill="var(--accent-blue)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {vendasPorPagamento.length > 0 && (
            <div className="gradient-card p-5">
              <h3 className="section-title">Vendas por Forma de Pagamento</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={vendasPorPagamento} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}>
                    {vendasPorPagamento.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12 }} formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {tipo === 'estoque' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card stat-card-green"><p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Entradas</p><p className="text-[24px] font-bold" style={{ color: 'var(--accent-green)' }}>{totalEstoqueItens}</p></div>
            <div className="stat-card stat-card-red"><p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Saidas</p><p className="text-[24px] font-bold" style={{ color: 'var(--accent-red)' }}>{totalEstoqueSaidas}</p></div>
            <div className="stat-card stat-card-blue"><p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Produtos</p><p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{estoque.length}</p></div>
          </div>
          <div className="gradient-card overflow-hidden">
            <table className="w-full table-modern">
              <thead><tr><th>Produto</th><th>Entradas</th><th>Saidas</th><th>Saldo</th></tr></thead>
              <tbody>
                {estoque.map((e, i) => (
                  <tr key={i} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{e.ProdutoNome}</td>
                    <td><span className="font-bold" style={{ color: 'var(--accent-green)' }}>+{e.Entradas}</span></td>
                    <td><span className="font-bold" style={{ color: 'var(--accent-red)' }}>-{e.Saidas}</span></td>
                    <td><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{e.Saldo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tipo === 'contador' && (
        <div className="gradient-card overflow-hidden">
          <table className="w-full table-modern">
            <thead><tr><th>Venda</th><th>Data</th><th>Cliente</th><th>Valor</th><th>Pagamento</th><th>NF-e</th></tr></thead>
            <tbody>
              {contador.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Nenhum dado encontrado</td></tr>
              ) : contador.map((c, i) => (
                <tr key={i} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td><span className="font-mono font-semibold" style={{ color: 'var(--accent-blue-light)' }}>#{c.VendaID}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.Data}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{c.Cliente}</td>
                  <td><span className="font-bold" style={{ color: 'var(--accent-green)' }}>R$ {(c.ValorTotal || 0).toFixed(2)}</span></td>
                  <td><span className="badge badge-info">{c.FormaPagamento}</span></td>
                  <td>
                    <span className={`badge ${c.StatusNF === 'autorizada' ? 'badge-success' : c.StatusNF === 'pendente' ? 'badge-warning' : 'badge-info'}`}>
                      {c.StatusNF || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
