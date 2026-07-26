import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { listarVendas, listarProdutos, listarClientes, type Venda, type Produto } from '../api'

interface Stats {
  totalVendas: number
  valorTotal: number
  totalProdutos: number
  totalClientes: number
  vendasHoje: number
  valorHoje: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalVendas: 0, valorTotal: 0, totalProdutos: 0, totalClientes: 0, vendasHoje: 0, valorHoje: 0 })
  const [vendasRecentes, setVendasRecentes] = useState<Venda[]>([])
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
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
      setVendasRecentes(vendas.slice(0, 8))
      setProdutosEstoqueBaixo(produtos.filter((p) => (p.Estoque || 0) <= (p.EstoqueMinimo || 5)).slice(0, 6))
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
    { label: 'Vendas Hoje', value: stats.vendasHoje, icon: ShoppingCart, gradient: 'var(--gradient-blue)', cardClass: 'stat-card-blue', change: '+12%', positive: true },
    { label: 'Faturamento Hoje', value: `R$ ${stats.valorHoje.toFixed(2)}`, icon: DollarSign, gradient: 'var(--gradient-green)', cardClass: 'stat-card-green', change: '+8%', positive: true },
    { label: 'Total Vendas', value: stats.totalVendas, icon: TrendingUp, gradient: 'var(--gradient-purple)', cardClass: 'stat-card-purple', change: '+23%', positive: true },
    { label: 'Faturamento Total', value: `R$ ${stats.valorTotal.toFixed(2)}`, icon: DollarSign, gradient: 'var(--gradient-amber)', cardClass: 'stat-card-amber', change: '+15%', positive: true },
    { label: 'Produtos', value: stats.totalProdutos, icon: Package, gradient: 'var(--gradient-cyan)', cardClass: 'stat-card-cyan', change: '+5', positive: true },
    { label: 'Clientes', value: stats.totalClientes, icon: Users, gradient: 'var(--gradient-purple)', cardClass: 'stat-card-purple', change: '+3', positive: true },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visao geral do seu negocio em tempo real</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`stat-card ${card.cardClass}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="icon-box" style={{ background: card.gradient }}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: card.positive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.change}
                </span>
              </div>
              <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
              <p className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 gradient-card">
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h3 className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>Vendas Recentes</h3>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Ultimas {vendasRecentes.length} vendas realizadas</p>
            </div>
            <span className="badge badge-success">{vendasRecentes.length} vendas</span>
          </div>
          <div className="p-2">
            {vendasRecentes.length === 0 ? (
              <div className="empty-state py-8">
                <ShoppingCart size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>Nenhuma venda encontrada</p>
              </div>
            ) : (
              <div className="space-y-1">
                {vendasRecentes.map((venda, i) => (
                  <div
                    key={venda.ID}
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
                    style={{ animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-blue-light)' }}>
                        #{venda.ID}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {venda.Cliente?.Nome || 'Cliente avulso'}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {venda.FormaPagamento} {venda.Vendedor ? `- ${venda.Vendedor}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold" style={{ color: 'var(--accent-green)' }}>
                        +R$ {(venda.ValorTotal || 0).toFixed(2)}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {new Date(venda.DataVenda).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 gradient-card">
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h3 className="font-semibold text-[15px] flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />
                Estoque Baixo
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Produtos que precisam de reposicao</p>
            </div>
            {produtosEstoqueBaixo.length > 0 && (
              <span className="badge badge-warning">{produtosEstoqueBaixo.length}</span>
            )}
          </div>
          <div className="p-2">
            {produtosEstoqueBaixo.length === 0 ? (
              <div className="empty-state py-8">
                <Package size={40} style={{ color: 'var(--accent-green)', opacity: 0.3 }} />
                <p className="text-sm mt-3 font-medium" style={{ color: 'var(--accent-green)' }}>Todos os produtos com estoque OK</p>
              </div>
            ) : (
              <div className="space-y-1">
                {produtosEstoqueBaixo.map((produto, i) => (
                  <div
                    key={produto.ID}
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
                    style={{ animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: produto.Estoque === 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)' }}>
                        <Package size={16} style={{ color: produto.Estoque === 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{produto.Nome}</p>
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
