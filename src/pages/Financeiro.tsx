import { useEffect, useState } from 'react'
import { Plus, Edit2, Filter } from 'lucide-react'
import { listarContas, salvarConta, type ContaFinanceira } from '../api'

export default function Financeiro() {
  const [contas, setContas] = useState<ContaFinanceira[]>([])
  const [filtro, setFiltro] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ContaFinanceira | null>(null)
  const [form, setForm] = useState({
    Descricao: '',
    Valor: '',
    Tipo: 'receita',
    Status: 'pendente',
    DataVencimento: '',
    Observacoes: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadContas() }, [])

  async function loadContas() {
    try {
      const res = await listarContas()
      setContas(res.data)
    } catch (err) {
      console.error('Erro ao carregar contas:', err)
    } finally {
      setLoading(false)
    }
  }

  const contasFiltradas = contas.filter((c) => {
    if (filtro === 'todos') return true
    return c.Status === filtro
  })

  const totalReceitas = contas.filter((c) => c.Tipo === 'receita' && c.Status === 'pago').reduce((a, c) => a + (c.Valor || 0), 0)
  const totalDespesas = contas.filter((c) => c.Tipo === 'despesa' && c.Status === 'pago').reduce((a, c) => a + (c.Valor || 0), 0)
  const totalPendente = contas.filter((c) => c.Status === 'pendente').reduce((a, c) => a + (c.Valor || 0), 0)

  function openNew() {
    setEditing(null)
    setForm({ Descricao: '', Valor: '', Tipo: 'receita', Status: 'pendente', DataVencimento: '', Observacoes: '' })
    setShowModal(true)
  }

  function openEdit(c: ContaFinanceira) {
    setEditing(c)
    setForm({
      Descricao: c.Descricao,
      Valor: String(c.Valor),
      Tipo: c.Tipo,
      Status: c.Status,
      DataVencimento: c.DataVencimento?.split('T')[0] || '',
      Observacoes: c.Observacoes || '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    try {
      await salvarConta({
        ...(editing ? { ID: editing.ID } : {}),
        Descricao: form.Descricao,
        Valor: parseFloat(form.Valor),
        Tipo: form.Tipo,
        Status: form.Status,
        DataVencimento: form.DataVencimento,
        Observacoes: form.Observacoes,
      })
      setShowModal(false)
      loadContas()
    } catch (err) {
      console.error('Erro ao salvar conta:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}>
          <p className="text-sm font-medium" style={{ color: '#166534' }}>Receitas Pagas</p>
          <p className="text-2xl font-bold" style={{ color: '#166534' }}>R$ {totalReceitas.toFixed(2)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <p className="text-sm font-medium" style={{ color: '#991b1b' }}>Despesas Pagas</p>
          <p className="text-2xl font-bold" style={{ color: '#991b1b' }}>R$ {totalDespesas.toFixed(2)}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
          <p className="text-sm font-medium" style={{ color: '#92400e' }}>Pendentes</p>
          <p className="text-2xl font-bold" style={{ color: '#92400e' }}>R$ {totalPendente.toFixed(2)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: 'var(--muted-foreground)' }} />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="pago">Pagos</option>
            <option value="atrasado">Atrasados</option>
          </select>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={16} /> Nova Conta
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Descricao</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Tipo</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Valor</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Vencimento</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                <th className="text-right p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {contasFiltradas.map((conta) => (
                <tr key={conta.ID} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3" style={{ color: 'var(--foreground)' }}>{conta.Descricao}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        background: conta.Tipo === 'receita' ? '#dcfce7' : '#fef2f2',
                        color: conta.Tipo === 'receita' ? '#166534' : '#991b1b',
                      }}
                    >
                      {conta.Tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>
                    R$ {(conta.Valor || 0).toFixed(2)}
                  </td>
                  <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>
                    {conta.DataVencimento ? new Date(conta.DataVencimento).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        background: conta.Status === 'pago' ? '#dcfce7' : conta.Status === 'atrasado' ? '#fef2f2' : '#fffbeb',
                        color: conta.Status === 'pago' ? '#166534' : conta.Status === 'atrasado' ? '#991b1b' : '#92400e',
                      }}
                    >
                      {conta.Status === 'pago' ? 'Pago' : conta.Status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(conta)} className="p-1 rounded hover:opacity-80" style={{ color: 'var(--primary)' }}>
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl p-6 w-full max-w-md shadow-xl" style={{ background: 'var(--card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              {editing ? 'Editar Conta' : 'Nova Conta'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Descricao</label>
                <input
                  value={form.Descricao}
                  onChange={(e) => setForm({ ...form, Descricao: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.Valor}
                    onChange={(e) => setForm({ ...form, Valor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Tipo</label>
                  <select
                    value={form.Tipo}
                    onChange={(e) => setForm({ ...form, Tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Vencimento</label>
                  <input
                    type="date"
                    value={form.DataVencimento}
                    onChange={(e) => setForm({ ...form, DataVencimento: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Status</label>
                  <select
                    value={form.Status}
                    onChange={(e) => setForm({ ...form, Status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Observacoes</label>
                <textarea
                  value={form.Observacoes}
                  onChange={(e) => setForm({ ...form, Observacoes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  rows={2}
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: 'var(--primary)' }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
