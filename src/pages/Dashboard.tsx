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

  useEffect(() => { if (lojaAtiva) loadData(); else setLoading(false) }, [lojaAtiva?.id])

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
    { label: 'Vendas Hoje', value: stats.vendasHoje, icon: ShoppingCart, color: '#3bafda', bgColor: '#e3f2fd', change: '+12%', positive: true },
    { label: 'Faturamento Hoje', value: `R$ ${stats.valorHoje.toFixed(2)}`, icon: DollarSign, color: '#26a69a', bgColor: '#e0f2f1', change: '+8%', positive: true },
    { label: 'Total Vendas', value: stats.totalVendas, icon: TrendingUp, color: '#7e57c2', bgColor: '#ede7f6', change: '+23%', positive: true },
    { label: 'Faturamento', value: `R$ ${stats.valorTotal.toFixed(2)}`, icon: DollarSign, color: '#ff9800', bgColor: '#fff3e0', change: '+15%', positive: true },
    { label: 'Produtos', value: stats.totalProdutos, icon: Package, color: '#42a5f5', bgColor: '#e3f2fd', change: '+5', positive: true },
    { label: 'Clientes', value: stats.totalClientes, icon: Users, color: '#ec407a', bgColor: '#fce4ec', change: '+3', positive: true },
  ]

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visao geral do seu negocio em tempo real</p>
        </div>
        <div className="page-header-right">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e8f5e9] text-[12px] font-medium text-[#2e7d32]">
            <Activity size={14} />
            Tempo real
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: card.bgColor }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                <span className="flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32]">
                  {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.change}
                </span>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
              <p className="text-[18px] font-bold" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Vendas Recentes */}
        <div className="lg:col-span-3 gradient-card">
          <div className="p-5 flex items-center justify-between border-b border-[#e8eaed]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#e3f2fd]">
                <Zap size={16} className="text-[#1565c0]" />
              </div>
              <div>
                <h3 className="font-semibold text-[14px] text-[#2d3436]">Vendas Recentes</h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Últimas vendas realizadas</p>
              </div>
            </div>
            <span className="badge badge-success">{vendasRecentes.length} vendas</span>
          </div>
          <div className="p-3">
            {vendasRecentes.length === 0 ? (
              <div className="empty-state py-10">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 bg-[#f5f7fa]">
                  <ShoppingCart size={22} style={{ color: '#9ca3af' }} />
                </div>
                <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>Nenhuma venda encontrada</p>
              </div>
            ) : (
              <div className="space-y-1">
                {vendasRecentes.map((venda) => (
                  <div key={venda.ID} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f0f2f5] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold bg-[#e3f2fd] text-[#1565c0]">
                        #{venda.ID}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#2d3436]">{venda.Cliente?.Nome || 'Cliente avulso'}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{venda.FormaPagamento} {venda.Vendedor ? `• ${venda.Vendedor}` : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-[#2e7d32]">+R$ {(venda.ValorTotal || 0).toFixed(2)}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{new Date(venda.DataVenda).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estoque Baixo */}
        <div className="lg:col-span-2 gradient-card">
          <div className="p-5 flex items-center justify-between border-b border-[#e8eaed]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#fff3e0]">
                <AlertTriangle size={16} className="text-[#e65100]" />
              </div>
              <div>
                <h3 className="font-semibold text-[14px] text-[#2d3436]">Estoque Baixo</h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Produtos críticos</p>
              </div>
            </div>
            {produtosEstoqueBaixo.length > 0 && (
              <span className="badge badge-danger">{produtosEstoqueBaixo.length}</span>
            )}
          </div>
          <div className="p-3">
            {produtosEstoqueBaixo.length === 0 ? (
              <div className="empty-state py-10">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 bg-[#e8f5e9]">
                  <Target size={22} className="text-[#2e7d32]" />
                </div>
                <p className="text-[13px] font-semibold text-[#2e7d32]">Todos ok!</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Nenhum produto com estoque baixo</p>
              </div>
            ) : (
              <div className="space-y-1">
                {produtosEstoqueBaixo.map((produto) => (
                  <div key={produto.ID} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f0f2f5] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: produto.Estoque === 0 ? '#ffebee' : '#fff3e0' }}>
                        <Package size={15} style={{ color: produto.Estoque === 0 ? '#c62828' : '#e65100' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#2d3436]">{produto.Nome}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Min: {produto.EstoqueMinimo || 5} {produto.Unidade || 'un'}</p>
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
