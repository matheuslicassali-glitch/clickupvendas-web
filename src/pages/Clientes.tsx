import { useEffect, useState } from 'react'
import { Plus, Edit2, Search } from 'lucide-react'
import { listarClientes, salvarCliente, type Cliente } from '../api'

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtro, setFiltro] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [form, setForm] = useState({ Nome: '', CPF: '', Telefone: '', Email: '', Endereco: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const res = await listarClientes()
      setClientes(res.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  function openNew() {
    setEditing(null)
    setForm({ Nome: '', CPF: '', Telefone: '', Email: '', Endereco: '' })
    setShowModal(true)
  }

  function openEdit(c: Cliente) {
    setEditing(c)
    setForm({ Nome: c.Nome, CPF: c.CPF || '', Telefone: c.Telefone || '', Email: c.Email || '', Endereco: c.Endereco || '' })
    setShowModal(true)
  }

  async function handleSave() {
    try {
      await salvarCliente({ ...(editing ? { ID: editing.ID } : {}), ...form })
      setShowModal(false)
      loadData()
    } catch (err) { console.error(err) }
  }

  const filtrados = clientes.filter((c) => {
    const f = filtro.toLowerCase()
    return c.Nome?.toLowerCase().includes(f) || c.CPF?.includes(f) || c.Telefone?.includes(f)
  })

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
          <input placeholder="Buscar clientes..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Nome</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>CPF</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Telefone</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Email</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Devedor</th>
                <th className="text-right p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.ID} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>{c.Nome}</td>
                  <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{c.CPF || '-'}</td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{c.Telefone || '-'}</td>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{c.Email || '-'}</td>
                  <td className="p-3 font-bold" style={{ color: (c.SaldoDevedor || 0) > 0 ? '#ef4444' : '#22c55e' }}>
                    R$ {(c.SaldoDevedor || 0).toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(c)} className="p-1 rounded hover:opacity-80" style={{ color: 'var(--primary)' }}><Edit2 size={16} /></button>
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{editing ? 'Editar' : 'Novo'} Cliente</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Nome *</label>
                <input value={form.Nome} onChange={(e) => setForm({ ...form, Nome: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>CPF</label>
                  <input value={form.CPF} onChange={(e) => setForm({ ...form, CPF: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Telefone</label>
                  <input value={form.Telefone} onChange={(e) => setForm({ ...form, Telefone: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Email</label>
                <input value={form.Email} onChange={(e) => setForm({ ...form, Email: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Endereco</label>
                <input value={form.Endereco} onChange={(e) => setForm({ ...form, Endereco: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
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
