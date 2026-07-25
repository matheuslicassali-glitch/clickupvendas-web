import { useEffect, useState } from 'react'
import { DollarSign } from 'lucide-react'
import { listarPagamentosFiado, listarClientes, type Cliente } from '../api'

interface PagamentoFiado {
  ID: number
  ClienteID: number
  Valor: number
  Data: string
  Observacoes?: string
}

export default function Fiado() {
  const [pagamentos, setPagamentos] = useState<PagamentoFiado[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtroCliente, setFiltroCliente] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [pRes, cRes] = await Promise.all([listarPagamentosFiado(), listarClientes()])
      setPagamentos(pRes.data as PagamentoFiado[])
      setClientes(cRes.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const clientesComDebito = clientes.filter((c) => (c.SaldoDevedor || 0) > 0)
  const totalDevido = clientesComDebito.reduce((a, c) => a + (c.SaldoDevedor || 0), 0)

  const pagamentosFiltrados = filtroCliente
    ? pagamentos.filter((p) => p.ClienteID === filtroCliente)
    : pagamentos

  function getClienteNome(id: number) {
    return clientes.find((c) => c.ID === id)?.Nome || `Cliente #${id}`
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} /></div>

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total em Debito</p>
          <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>R$ {totalDevido.toFixed(2)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Clientes com Debito</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{clientesComDebito.length}</p>
        </div>
      </div>

      {/* Clientes com debito */}
      {clientesComDebito.length > 0 && (
        <div className="rounded-xl shadow-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Clientes com Debito</h3>
          </div>
          <div className="p-4 space-y-3">
            {clientesComDebito.map((c) => (
              <div key={c.ID} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{c.Nome}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.Telefone || 'Sem telefone'}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: '#ef4444' }}>R$ {(c.SaldoDevedor || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historico de pagamentos */}
      <div className="flex items-center gap-2">
        <DollarSign size={18} style={{ color: 'var(--primary)' }} />
        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Historico de Pagamentos</h3>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value ? Number(e.target.value) : '')}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="">Todos os clientes</option>
          {clientes.map((c) => (
            <option key={c.ID} value={c.ID}>{c.Nome}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Data</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Cliente</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Valor</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Observacoes</th>
              </tr>
            </thead>
            <tbody>
              {pagamentosFiltrados.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center" style={{ color: 'var(--muted-foreground)' }}>Nenhum pagamento registrado</td></tr>
              ) : (
                pagamentosFiltrados.map((p: PagamentoFiado) => (
                  <tr key={p.ID} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{new Date(p.Data).toLocaleString('pt-BR')}</td>
                    <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>{getClienteNome(p.ClienteID)}</td>
                    <td className="p-3 font-bold" style={{ color: '#22c55e' }}>R$ {(p.Valor || 0).toFixed(2)}</td>
                    <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{p.Observacoes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
