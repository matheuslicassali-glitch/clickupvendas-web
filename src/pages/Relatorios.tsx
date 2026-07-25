import { useEffect, useState } from 'react'
import { BarChart3, Calendar } from 'lucide-react'
import { listarVendas, relatorioEstoque, relatorioContador, type Venda, type RelatorioEstoque, type RelatorioContadorItem } from '../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

type RelatorioTipo = 'vendas' | 'estoque' | 'contador'

export default function Relatorios() {
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

  useEffect(() => { loadReport() }, [tipo, periodo, dataInicio, dataFim])

  async function loadReport() {
    setLoading(true)
    try {
      if (tipo === 'vendas') {
        const res = await listarVendas()
        setVendas(res.data)
      } else if (tipo === 'estoque') {
        const res = await relatorioEstoque(periodo)
        setEstoque(res.data)
      } else if (tipo === 'contador') {
        if (dataInicio && dataFim) {
          const res = await relatorioContador({ data_inicio: dataInicio, data_fim: dataFim })
          setContador(res.data)
        }
      }
    } catch (err) {
      console.error('Erro ao carregar relatorio:', err)
    } finally {
      setLoading(false)
    }
  }

  // Vendas por dia (grafico)
  function getVendasPorDia() {
    const map: Record<string, { vendas: number; valor: number }> = {}
    vendas.forEach((v) => {
      const dia = new Date(v.DataVenda).toLocaleDateString('pt-BR')
      if (!map[dia]) map[dia] = { vendas: 0, valor: 0 }
      map[dia].vendas++
      map[dia].valor += v.ValorTotal || 0
    })
    return Object.entries(map).map(([dia, data]) => ({
      name: dia,
      vendas: data.vendas,
      valor: data.valor,
    }))
  }

  // Vendas por forma de pagamento (pie)
  function getVendasPorPagamento() {
    const map: Record<string, number> = {}
    vendas.forEach((v) => {
      const fp = v.FormaPagamento || 'Outro'
      map[fp] = (map[fp] || 0) + (v.ValorTotal || 0)
    })
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6']
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }))
  }

  const vendasPorDia = getVendasPorDia()
  const vendasPorPagamento = getVendasPorPagamento()

  const totalVendasPeriodo = vendas.reduce((a, v) => a + (v.ValorTotal || 0), 0)
  const totalEstoqueItens = estoque.reduce((a, e) => a + e.Entradas, 0)
  const totalEstoqueSaidas = estoque.reduce((a, e) => a + e.Saidas, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={24} style={{ color: 'var(--primary)' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Relatorios</h2>
      </div>

      {/* Tipo selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'vendas' as const, label: 'Vendas' },
          { key: 'estoque' as const, label: 'Estoque' },
          { key: 'contador' as const, label: 'Contabil' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTipo(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: tipo === t.key ? 'var(--primary)' : 'var(--muted)',
              color: tipo === t.key ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Periodo filters */}
      {tipo === 'vendas' && (
        <div className="flex items-center gap-3 flex-wrap">
          <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
          {['dia', 'semana', 'mes'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: periodo === p ? 'var(--primary)' : 'var(--muted)',
                color: periodo === p ? 'var(--primary-foreground)' : 'var(--foreground)',
              }}
            >
              {p === 'dia' ? 'Dia' : p === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      )}

      {tipo === 'contador' && (
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Inicio</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} />
        </div>
      ) : (
        <>
          {/* Vendas Report */}
          {tipo === 'vendas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Vendas</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{vendas.length}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Faturamento</p>
                  <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>R$ {totalVendasPeriodo.toFixed(2)}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ticket Medio</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    R$ {vendas.length > 0 ? (totalVendasPeriodo / vendas.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Grafico vendas por dia */}
              {vendasPorDia.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Vendas por Dia</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vendasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                      <Tooltip
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                        formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                      />
                      <Bar dataKey="valor" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Grafico vendas por pagamento */}
              {vendasPorPagamento.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Vendas por Forma de Pagamento</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={vendasPorPagamento}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                      >
                        {vendasPorPagamento.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Estoque Report */}
          {tipo === 'estoque' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Entradas</p>
                  <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{totalEstoqueItens}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Saidas</p>
                  <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{totalEstoqueSaidas}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Produtos</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{estoque.length}</p>
                </div>
              </div>

              <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--muted)' }}>
                        <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Produto</th>
                        <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Entradas</th>
                        <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Saidas</th>
                        <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estoque.map((e, i) => (
                        <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                          <td className="p-3" style={{ color: 'var(--foreground)' }}>{e.ProdutoNome}</td>
                          <td className="p-3 font-medium" style={{ color: '#22c55e' }}>+{e.Entradas}</td>
                          <td className="p-3 font-medium" style={{ color: '#ef4444' }}>-{e.Saidas}</td>
                          <td className="p-3 font-bold" style={{ color: 'var(--foreground)' }}>{e.Saldo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Contador Report */}
          {tipo === 'contador' && (
            <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--muted)' }}>
                      <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Venda</th>
                      <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Data</th>
                      <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Cliente</th>
                      <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Valor</th>
                      <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Pagamento</th>
                      <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>NF-e</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contador.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center" style={{ color: 'var(--muted-foreground)' }}>
                          Nenhum dado encontrado para o periodo selecionado
                        </td>
                      </tr>
                    ) : (
                      contador.map((c, i) => (
                        <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                          <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>#{c.VendaID}</td>
                          <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{c.Data}</td>
                          <td className="p-3" style={{ color: 'var(--foreground)' }}>{c.Cliente}</td>
                          <td className="p-3 font-bold" style={{ color: '#22c55e' }}>R$ {(c.ValorTotal || 0).toFixed(2)}</td>
                          <td className="p-3" style={{ color: 'var(--foreground)' }}>{c.FormaPagamento}</td>
                          <td className="p-3">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                background: c.StatusNF === 'autorizada' ? '#dcfce7' : c.StatusNF === 'pendente' ? '#fffbeb' : '#f1f5f9',
                                color: c.StatusNF === 'autorizada' ? '#166534' : c.StatusNF === 'pendente' ? '#92400e' : '#64748b',
                              }}
                            >
                              {c.StatusNF || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
