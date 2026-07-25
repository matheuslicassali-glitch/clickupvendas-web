import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react'
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
  const [stats, setStats] = useState<Stats>({
    totalVendas: 0,
    valorTotal: 0,
    totalProdutos: 0,
    totalClientes: 0,
    vendasHoje: 0,
    valorHoje: 0,
  })
  const [vendasRecentes, setVendasRecentes] = useState<Venda[]>([])
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [vendasRes, produtosRes, clientesRes] = await Promise.all([
        listarVendas(),
        listarProdutos(),
        listarClientes(),
      ])

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

      setVendasRecentes(vendas.slice(0, 10))
      setProdutosEstoqueBaixo(produtos.filter((p) => (p.Estoque || 0) <= (p.EstoqueMinimo || 5)).slice(0, 10))
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} />
      </div>
    )
  }

  const cards = [
    { label: 'Vendas Hoje', value: stats.vendasHoje, icon: ShoppingCart, color: '#6366f1' },
    { label: 'Valor Hoje', value: `R$ ${stats.valorHoje.toFixed(2)}`, icon: DollarSign, color: '#22c55e' },
    { label: 'Total Vendas', value: stats.totalVendas, icon: TrendingUp, color: '#f59e0b' },
    { label: 'Faturamento', value: `R$ ${stats.valorTotal.toFixed(2)}`, icon: DollarSign, color: '#06b6d4' },
    { label: 'Produtos', value: stats.totalProdutos, icon: Package, color: '#8b5cf6' },
    { label: 'Clientes', value: stats.totalClientes, icon: Users, color: '#ec4899' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-xl p-4 shadow-sm"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${card.color}20` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{card.label}</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Recentes */}
        <div className="rounded-xl shadow-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Vendas Recentes</h3>
          </div>
          <div className="p-4">
            {vendasRecentes.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>Nenhuma venda encontrada</p>
            ) : (
              <div className="space-y-3">
                {vendasRecentes.map((venda) => (
                  <div
                    key={venda.ID}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'var(--muted)' }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Venda #{venda.ID}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {venda.Cliente?.Nome || 'Sem cliente'} - {venda.FormaPagamento}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#22c55e' }}>
                        R$ {(venda.ValorTotal || 0).toFixed(2)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
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
        <div className="rounded-xl shadow-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <TrendingDown size={18} style={{ color: '#ef4444' }} />
              Estoque Baixo
            </h3>
          </div>
          <div className="p-4">
            {produtosEstoqueBaixo.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
                Todos os produtos com estoque ok
              </p>
            ) : (
              <div className="space-y-3">
                {produtosEstoqueBaixo.map((produto) => (
                  <div
                    key={produto.ID}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'var(--muted)' }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{produto.Nome}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Min: {produto.EstoqueMinimo || 5} {produto.Unidade || 'un'}
                      </p>
                    </div>
                    <span
                      className="text-sm font-bold px-2 py-1 rounded"
                      style={{
                        background: produto.Estoque === 0 ? '#fef2f2' : '#fffbeb',
                        color: produto.Estoque === 0 ? '#ef4444' : '#f59e0b',
                      }}
                    >
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
