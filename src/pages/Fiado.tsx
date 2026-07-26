import { useEffect, useState } from 'react'
import { CreditCard, AlertTriangle } from 'lucide-react'
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

  const pagamentosFiltrados = filtroCliente ? pagamentos.filter((p) => p.ClienteID === filtroCliente) : pagamentos

  function getClienteNome(id: number) { return clientes.find((c) => c.ID === id)?.Nome || `Cliente #${id}` }

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Fiado</h1>
        <p className="page-subtitle">Controle de debitos e pagamentos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="stat-card stat-card-red">
          <div className="flex items-start justify-between mb-3">
            <div className="icon-box" style={{ background: 'var(--gradient-red)' }}><AlertTriangle size={20} className="text-white" /></div>
          </div>
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total em Debito</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--accent-red)' }}>R$ {totalDevido.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-card-amber">
          <div className="flex items-start justify-between mb-3">
            <div className="icon-box" style={{ background: 'var(--gradient-amber)' }}><CreditCard size={20} className="text-white" /></div>
          </div>
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Clientes com Debito</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{clientesComDebito.length}</p>
        </div>
      </div>

      {clientesComDebito.length > 0 && (
        <div className="gradient-card">
          <div className="p-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="section-title">Clientes com Debito</h3>
          </div>
          <div className="p-4 space-y-2">
            {clientesComDebito.map((c, i) => (
              <div key={c.ID} className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-white/[0.02]" style={{ background: 'var(--bg-surface)', animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-red-light)' }}>
                    {c.Nome?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{c.Nome}</p>
                    <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{c.Telefone || 'Sem telefone'}</p>
                  </div>
                </div>
                <span className="badge badge-danger">R$ {(c.SaldoDevedor || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="section-title">Historico de Pagamentos</h3>
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value ? Number(e.target.value) : '')}
          className="px-4 py-2.5 rounded-xl text-[13px] font-medium"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        >
          <option value="">Todos os clientes</option>
          {clientes.map((c) => <option key={c.ID} value={c.ID}>{c.Nome}</option>)}
        </select>
      </div>

      <div className="gradient-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-modern">
            <thead><tr><th>Data</th><th>Cliente</th><th>Valor</th><th>Observacoes</th></tr></thead>
            <tbody>
              {pagamentosFiltrados.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Nenhum pagamento registrado</td></tr>
              ) : pagamentosFiltrados.map((p: PagamentoFiado, i) => (
                <tr key={p.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(p.Data).toLocaleString('pt-BR')}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{getClienteNome(p.ClienteID)}</td>
                  <td><span className="font-bold" style={{ color: 'var(--accent-green)' }}>R$ {(p.Valor || 0).toFixed(2)}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.Observacoes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
