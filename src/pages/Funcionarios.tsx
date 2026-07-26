import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { listarFuncionarios, type Funcionario } from '../api'

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])
  async function loadData() {
    try { const res = await listarFuncionarios(); setFuncionarios(res.data) } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const filtrados = funcionarios.filter((f) => f.Nome?.toLowerCase().includes(filtro.toLowerCase()) || f.Cargo?.toLowerCase().includes(filtro.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Funcionarios</h1>
        <p className="page-subtitle">{funcionarios.length} funcionarios cadastrados</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input placeholder="Buscar por nome ou cargo..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="search-input" />
      </div>

      <div className="gradient-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-modern">
            <thead><tr><th>Nome</th><th>Cargo</th><th>Telefone</th><th>Status</th></tr></thead>
            <tbody>
              {filtrados.map((f, i) => (
                <tr key={f.ID} style={{ animation: `fadeIn 0.3s ease-out ${i * 30}ms forwards`, opacity: 0 }}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{f.Nome}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.Cargo || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.Telefone || '-'}</td>
                  <td>
                    <span className={`badge ${f.Ativo ? 'badge-success' : 'badge-danger'}`}>
                      {f.Ativo ? 'Ativo' : 'Inativo'}
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
