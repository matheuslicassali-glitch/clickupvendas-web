import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, Zap, Target } from 'lucide-react'
import { listarVendas, listarProdutos, listarClientes, type Venda, type Produto } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

interface Stats {
  totalVendas: number
  valorTotal: number
  totalProdutos: number
  totalClientes: number
  vendasHoje: number
  valorHoje: number
}

export default function Dashboard() {
  const { lojaAtiva } = useStore()
  const [stats, setStats] = useState<Stats>({ totalVendas: 0, valorTotal: 0, totalProdutos: 0, totalClientes: 0, vendasHoje: 0, valorHoje: 0 })
  const [vendasRecentes, setVendasRecentes] = useState<Venda[]>([])
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadData() }, [lojaAtiva?.id])

  async function loadData() {
    setLoading(true)
    try {
      const [vendasRes, produtosRes, clientesRes] = await Promise.all([listarVendas(), listarProdutos(), listarClientes()])
      const vendas = vendasRes.data
      const produtos = produtosRes.data
      const clientes = clientesRes.data
      const hoje = new Date().toISOString().split('T')[0]
      const vendasHoje = vendas.filter((v) => v.DataVenda?.startsWith(hoje))
      setStats({
        totalVendas: vendas.length,
        valorTotal: vendas.reduce((acc, v) => acc + (v.ValorTotal || 0), 0),
        totalProdutos: produtos.length,
        totalClientes: clientes.length,
        vendasHoje: vendasHoje.length,
        valorHoje: vendasHoje.reduce((acc, v) => acc + (v.ValorTotal || 0), 0),
      })
      setVendasRecentes(vendas.slice(0, 6))
      setProdutosEstoqueBaixo(produtos.filter((p) => (p.Estoque || 0) <= (p.EstoqueMinimo || 5)).slice(0, 5))
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="loading-spinner" />
      </div>
    )
  }

  const cards = [
    { label: 'Vendas Hoje', value: stats.vendasHoje, icon: ShoppingCart, gradient: 'linear-gradient(135deg, #667eea, #764ba2)', cardClass: 'stat-card-blue', change: '+12%', positive: true },
    { label: 'Faturamento Hoje', value: `R$ ${stats.valorHoje.toFixed(2)}`, icon: DollarSign, gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', cardClass: 'stat-card-green', change: '+8%', positive: true },
    { label: 'Total Vendas', value: stats.totalVendas, icon: TrendingUp, gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', cardClass: 'stat-card-purple', change: '+23%', positive: true },
    { label: 'Faturamento', value: `R$ ${stats.valorTotal.toFixed(2)}`, icon: DollarSign, gradient: 'linear-gradient(135deg, #f7971e, #ffd200)', cardClass: 'stat-card-amber', change: '+15%', positive: true },
    { label: 'Produtos', value: stats.totalProdutos, icon: Package, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', cardClass: 'stat-card-cyan', change: '+5', positive: true },
    { label: 'Clientes', value: stats.totalClientes, icon: Users, gradient: 'linear-gradient(135deg, #fa709a, #fee140)', cardClass: 'stat-card-purple', change: '+3', positive: true },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visao geral do seu negocio em tempo real</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
          <Activity size={14} style={{ color: '#38ef7d' }} />
          <span className="text-[12px] font-medium" style={{ color: '#64748b' }}>Tempo real</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`stat-card ${card.cardClass}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="icon-box" style={{ background: card.gradient, boxShadow: `0 4px 20px ${card.gradient.match(/#[0-9a-f]+/i)?.[0]}33` }}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{
                  background: card.positive ? 'rgba(56, 239, 125, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: card.positive ? '#38ef7d' : '#f87171',
                  border: `1px solid ${card.positive ? 'rgba(56, 239, 125, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                }}>
                  {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.change}
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#475569' }}>{card.label}</p>
              <p className="text-[20px] font-extrabold tracking-tight" style={{ color: '#f1f5f9' }}>{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Vendas Recentes */}
        <div className="lg:col-span-3 gradient-card">
          <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)' }}>
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[15px]" style={{ color: '#f1f5f9' }}>Vendas Recentes</h3>
                <p className="text-[12px]" style={{ color: '#475569' }}>Ultimas vendas realizadas</p>
              </div>
            </div>
            <span className="badge badge-success">{vendasRecentes.length} vendas</span>
          </div>
          <div className="p-3">
            {vendasRecentes.length === 0 ? (
              <div className="empty-state py-10">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <ShoppingCart size={28} style={{ color: '#334155' }} />
                </div>
                <p className="text-[13px] font-medium" style={{ color: '#475569' }}>Nenhuma venda encontrada</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {vendasRecentes.map((venda, i) => (
                  <div
                    key={venda.ID}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] cursor-default"
                    style={{ animation: `fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms forwards`, opacity: 0 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[13px] font-bold" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))', color: '#a78bfa' }}>
                        #{venda.ID}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: '#e2e8f0' }}>
                          {venda.Cliente?.Nome || 'Cliente avulso'}
                        </p>
                        <p className="text-[11px] font-medium" style={{ color: '#475569' }}>
                          {venda.FormaPagamento} {venda.Vendedor ? `• ${venda.Vendedor}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold" style={{ color: '#38ef7d' }}>
                        +R$ {(venda.ValorTotal || 0).toFixed(2)}
                      </p>
                      <p className="text-[11px] font-medium" style={{ color: '#475569' }}>
                        {new Date(venda.DataVenda).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estoque Baixo */}
        <div className="lg:col-span-2 gradient-card">
          <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ee0979, #ff6a00)', boxShadow: '0 4px 12px rgba(238, 9, 121, 0.2)' }}>
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[15px]" style={{ color: '#f1f5f9' }}>Estoque Baixo</h3>
                <p className="text-[12px]" style={{ color: '#475569' }}>Produtos criticos</p>
              </div>
            </div>
            {produtosEstoqueBaixo.length > 0 && (
              <span className="badge badge-danger">{produtosEstoqueBaixo.length}</span>
            )}
          </div>
          <div className="p-3">
            {produtosEstoqueBaixo.length === 0 ? (
              <div className="empty-state py-10">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'rgba(56, 239, 125, 0.08)' }}>
                  <Target size={28} style={{ color: '#38ef7d' }} />
                </div>
                <p className="text-[13px] font-semibold" style={{ color: '#38ef7d' }}>Todos ok!</p>
                <p className="text-[11px] mt-1" style={{ color: '#475569' }}>Nenhum produto com estoque baixo</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {produtosEstoqueBaixo.map((produto, i) => (
                  <div
                    key={produto.ID}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] cursor-default"
                    style={{ animation: `fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms forwards`, opacity: 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: produto.Estoque === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                        <Package size={16} style={{ color: produto.Estoque === 0 ? '#f87171' : '#fbbf24' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: '#e2e8f0' }}>{produto.Nome}</p>
                        <p className="text-[11px] font-medium" style={{ color: '#475569' }}>Min: {produto.EstoqueMinimo || 5} {produto.Unidade || 'un'}</p>
                      </div>
                    </div>
                    <span className={`badge ${produto.Estoque === 0 ? 'badge-danger' : 'badge-warning'}`}>
                      {produto.Estoque || 0} {produto.Unidade || 'un'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
