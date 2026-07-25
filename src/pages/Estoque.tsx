import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { listarProdutos, salvarProduto, deletarProduto, listarMovimentacoesEstoque, type Produto, type MovimentacaoEstoque } from '../api'

export default function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [tab, setTab] = useState<'produtos' | 'movimentacoes'>('produtos')
  const [filtro, setFiltro] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Produto | null>(null)
  const [form, setForm] = useState({
    Nome: '',
    Preco: '',
    Custo: '',
    Estoque: '',
    EstoqueMinimo: '',
    Unidade: 'un',
    CodigoBarras: '',
    Marca: '',
    Descricao: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const [pRes, mRes] = await Promise.all([listarProdutos(), listarMovimentacoesEstoque()])
      setProdutos(pRes.data)
      setMovimentacoes(mRes.data)
    } catch (err) {
      console.error('Erro ao carregar estoque:', err)
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditing(null)
    setForm({ Nome: '', Preco: '', Custo: '', Estoque: '', EstoqueMinimo: '5', Unidade: 'un', CodigoBarras: '', Marca: '', Descricao: '' })
    setShowModal(true)
  }

  function openEdit(p: Produto) {
    setEditing(p)
    setForm({
      Nome: p.Nome,
      Preco: String(p.Preco || ''),
      Custo: String(p.Custo || ''),
      Estoque: String(p.Estoque || ''),
      EstoqueMinimo: String(p.EstoqueMinimo || 5),
      Unidade: p.Unidade || 'un',
      CodigoBarras: p.CodigoBarras || '',
      Marca: p.Marca || '',
      Descricao: p.Descricao || '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    try {
      await salvarProduto({
        ...(editing ? { ID: editing.ID } : {}),
        Nome: form.Nome,
        Preco: parseFloat(form.Preco) || 0,
        Custo: parseFloat(form.Custo) || 0,
        Estoque: parseInt(form.Estoque) || 0,
        EstoqueMinimo: parseInt(form.EstoqueMinimo) || 5,
        Unidade: form.Unidade,
        CodigoBarras: form.CodigoBarras,
        Marca: form.Marca,
        Descricao: form.Descricao,
        Ativo: true,
      })
      setShowModal(false)
      loadData()
    } catch (err) {
      console.error('Erro ao salvar produto:', err)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    try {
      await deletarProduto(id)
      loadData()
    } catch (err) {
      console.error('Erro ao excluir produto:', err)
    }
  }

  const produtosFiltrados = produtos.filter((p) => {
    const f = filtro.toLowerCase()
    return (
      p.Nome?.toLowerCase().includes(f) ||
      p.CodigoBarras?.toLowerCase().includes(f) ||
      p.Marca?.toLowerCase().includes(f)
    )
  })

  const movFiltradas = movimentacoes.filter((m) => {
    if (filtroTipo && m.Tipo !== filtroTipo) return false
    if (filtro) {
      const f = filtro.toLowerCase()
      return m.Produto?.Nome?.toLowerCase().includes(f) || m.Descricao?.toLowerCase().includes(f)
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'produtos' as const, label: 'Produtos' },
          { key: 'movimentacoes' as const, label: 'Movimentacoes' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: tab === t.key ? 'var(--primary)' : 'var(--muted)',
              color: tab === t.key ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
          <input
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
          {tab === 'movimentacoes' && (
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="">Todos Tipos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saida</option>
              <option value="venda">Venda</option>
              <option value="ajuste">Ajuste</option>
            </select>
          )}
        </div>
        {tab === 'produtos' && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={16} /> Novo Produto
          </button>
        )}
      </div>

      {/* Produtos Table */}
      {tab === 'produtos' && (
        <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Produto</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Codigo</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Marca</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Preco</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Estoque</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Minimo</th>
                  <th className="text-right p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((p) => (
                  <tr key={p.ID} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>{p.Nome}</td>
                    <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{p.CodigoBarras || '-'}</td>
                    <td className="p-3" style={{ color: 'var(--foreground)' }}>{p.Marca || '-'}</td>
                    <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>R$ {(p.Preco || 0).toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{
                          background: (p.Estoque || 0) <= 0 ? '#fef2f2' : (p.Estoque || 0) <= (p.EstoqueMinimo || 5) ? '#fffbeb' : '#dcfce7',
                          color: (p.Estoque || 0) <= 0 ? '#ef4444' : (p.Estoque || 0) <= (p.EstoqueMinimo || 5) ? '#92400e' : '#166534',
                        }}
                      >
                        {p.Estoque || 0} {p.Unidade || 'un'}
                      </span>
                    </td>
                    <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{p.EstoqueMinimo || 5}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1 rounded hover:opacity-80 mr-2" style={{ color: 'var(--primary)' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.ID)} className="p-1 rounded hover:opacity-80" style={{ color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movimentacoes Table */}
      {tab === 'movimentacoes' && (
        <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Data</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Produto</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Tipo</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Quantidade</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--muted-foreground)' }}>Descricao</th>
                </tr>
              </thead>
              <tbody>
                {movFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center" style={{ color: 'var(--muted-foreground)' }}>
                      Nenhuma movimentacao encontrada
                    </td>
                  </tr>
                ) : (
                  movFiltradas.map((m) => (
                    <tr key={m.ID} style={{ borderTop: '1px solid var(--border)' }}>
                      <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(m.Data).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>
                        {m.Produto?.Nome || `Produto #${m.ProdutoID}`}
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            background: m.Tipo === 'entrada' ? '#dcfce7' : m.Tipo === 'saida' || m.Tipo === 'venda' ? '#fef2f2' : '#eff6ff',
                            color: m.Tipo === 'entrada' ? '#166534' : m.Tipo === 'saida' || m.Tipo === 'venda' ? '#991b1b' : '#1e40af',
                          }}
                        >
                          {m.Tipo === 'entrada' ? 'Entrada' : m.Tipo === 'saida' ? 'Saida' : m.Tipo === 'venda' ? 'Venda' : 'Ajuste'}
                        </span>
                      </td>
                      <td className="p-3 font-medium" style={{
                        color: m.Tipo === 'entrada' ? '#22c55e' : '#ef4444'
                      }}>
                        {m.Tipo === 'entrada' ? '+' : '-'}{m.Quantidade}
                      </td>
                      <td className="p-3" style={{ color: 'var(--muted-foreground)' }}>{m.Descricao || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl p-6 w-full max-w-lg shadow-xl" style={{ background: 'var(--card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              {editing ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Nome *</label>
                <input
                  value={form.Nome}
                  onChange={(e) => setForm({ ...form, Nome: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Preco de Venda</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.Preco}
                    onChange={(e) => setForm({ ...form, Preco: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Preco de Custo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.Custo}
                    onChange={(e) => setForm({ ...form, Custo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Estoque</label>
                  <input
                    type="number"
                    value={form.Estoque}
                    onChange={(e) => setForm({ ...form, Estoque: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimo</label>
                  <input
                    type="number"
                    value={form.EstoqueMinimo}
                    onChange={(e) => setForm({ ...form, EstoqueMinimo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Unidade</label>
                  <select
                    value={form.Unidade}
                    onChange={(e) => setForm({ ...form, Unidade: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="lt">lt</option>
                    <option value="mt">mt</option>
                    <option value="cx">cx</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Codigo de Barras</label>
                  <input
                    value={form.CodigoBarras}
                    onChange={(e) => setForm({ ...form, CodigoBarras: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Marca</label>
                  <input
                    value={form.Marca}
                    onChange={(e) => setForm({ ...form, Marca: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Descricao</label>
                <textarea
                  value={form.Descricao}
                  onChange={(e) => setForm({ ...form, Descricao: e.target.value })}
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
