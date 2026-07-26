import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { listarFornecedores, type Fornecedor } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Fornecedores() {
  const { lojaAtiva } = useStore()
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadData() }, [lojaAtiva?.id])

  async function loadData() {
    setLoading(true)
    try { const res = await listarFornecedores(); setFornecedores(res.data) } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const filtrados = fornecedores.filter((f) => f.Nome?.toLowerCase().includes(filtro.toLowerCase()) || f.CNPJ?.includes(filtro))

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Fornecedores</h1>
          <p className="page-subtitle">{fornecedores.length} fornecedores cadastrados</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Buscar por nome ou CNPJ..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="search-input" />
      </div>

      <div className="gradient-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-modern">
            <thead><tr><th>Nome</th><th>CNPJ</th><th>Telefone</th><th>Email</th></tr></thead>
            <tbody>
              {filtrados.map((f, i) => (
                <tr key={f.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.Nome}</td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{f.CNPJ || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.Telefone || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.Email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
