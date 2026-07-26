import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { listarClientes, type Cliente } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Clientes() {
  const { lojaAtiva } = useStore()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadData(); else setLoading(false) }, [lojaAtiva?.id])

  async function loadData() {
    setLoading(true)
    try { const res = await listarClientes(); setClientes(res.data) } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const filtrados = clientes.filter((c) => {
    const f = filtro.toLowerCase()
    return c.Nome?.toLowerCase().includes(f) || c.CPF?.includes(f) || c.Telefone?.includes(f)
  })

  const totalDevedores = clientes.filter((c) => (c.SaldoDevedor || 0) > 0).reduce((a, c) => a + (c.SaldoDevedor || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clientes.length} clientes cadastrados | {filtrados.length} exibidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="stat-card stat-card-blue">
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total de Clientes</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{clientes.length}</p>
        </div>
        <div className="stat-card stat-card-red">
          <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total em Debito</p>
          <p className="text-[24px] font-bold" style={{ color: 'var(--accent-red)' }}>R$ {totalDevedores.toFixed(2)}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Buscar por nome, CPF ou telefone..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="search-input" />
      </div>

      <div className="gradient-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-modern">
            <thead><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>Email</th><th>Debito</th></tr></thead>
            <tbody>
              {filtrados.map((c, i) => (
                <tr key={c.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.Nome}</td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{c.CPF || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.Telefone || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.Email || '-'}</td>
                  <td>
                    <span className={`badge ${(c.SaldoDevedor || 0) > 0 ? 'badge-danger' : 'badge-success'}`}>
                      R$ {(c.SaldoDevedor || 0).toFixed(2)}
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
