import { useEffect, useState } from 'react'
import { Plus, Edit2, Search } from 'lucide-react'
import { listarFuncionarios, salvarFuncionario, type Funcionario } from '../api'

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [filtro, setFiltro] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Funcionario | null>(null)
  const [form, setForm] = useState({ Nome: '', Cargo: '', Telefone: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try { const res = await listarFuncionarios(); setFuncionarios(res.data) } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm({ Nome: '', Cargo: '', Telefone: '' }); setShowModal(true) }
  function openEdit(f: Funcionario) { setEditing(f); setForm({ Nome: f.Nome, Cargo: f.Cargo || '', Telefone: f.Telefone || '' }); setShowModal(true) }

  async function handleSave() {
    try { await salvarFuncionario({ ...(editing ? { ID: editing.ID } : {}), ...form, Ativo: true }); setShowModal(false); loadData() } catch (err) { console.error(err) }
  }

  const filtrados = funcionarios.filter((f) => f.Nome?.toLowerCase().includes(filtro.toLowerCase()) || f.Cargo?.toLowerCase().includes(filtro.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
          <input placeholder="Buscar funcionarios..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
          <Plus size={16} /> Novo Funcionario
        </button>
      </div>

      <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Nome</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Cargo</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Telefone</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                <th className="text-right p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((f) => (
                <tr key={f.ID} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>{f.Nome}</td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{f.Cargo || '-'}</td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{f.Telefone || '-'}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: f.Ativo ? '#dcfce7' : '#fef2f2', color: f.Ativo ? '#166534' : '#991b1b' }}>
                      {f.Ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(f)} className="p-1 rounded hover:opacity-80" style={{ color: 'var(--primary)' }}><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl p-6 w-full max-w-md shadow-xl" style={{ background: 'var(--card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{editing ? 'Editar' : 'Novo'} Funcionario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Nome *</label>
                <input value={form.Nome} onChange={(e) => setForm({ ...form, Nome: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Cargo</label>
                  <input value={form.Cargo} onChange={(e) => setForm({ ...form, Cargo: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Telefone</label>
                  <input value={form.Telefone} onChange={(e) => setForm({ ...form, Telefone: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
