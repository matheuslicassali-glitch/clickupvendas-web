import { useState } from 'react'
import { Store, Plus, Trash2, Check, Edit3, X } from 'lucide-react'
import { useStore } from '../contexts/StoreContext'
import type { Loja } from '../lib/supabase'

export default function Lojas() {
  const { lojas, lojaAtiva, selecionar, adicionar, remover, atualizar } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle')
  const [testMsg, setTestMsg] = useState('')

  function resetForm() {
    setNome('')
    setUrl('')
    setKey('')
    setEditId(null)
    setShowForm(false)
    setTestStatus('idle')
    setTestMsg('')
  }

  function startEdit(loja: Loja) {
    setNome(loja.nome)
    setUrl(loja.supabaseUrl)
    setKey(loja.supabaseKey)
    setEditId(loja.id)
    setShowForm(true)
    setTestStatus('idle')
    setTestMsg('')
  }

  async function handleTest() {
    if (!url || !key) { setTestMsg('Preencha URL e Key'); setTestStatus('error'); return }
    setTestStatus('testing')
    setTestMsg('Testando conexao...')
    try {
      const testClient = (await import('@supabase/supabase-js')).createClient(url, key, { auth: { persistSession: false } })
      const { error } = await testClient.from('produtos').select('id').limit(1)
      if (error) throw error
      setTestStatus('ok')
      setTestMsg('Conexao OK!')
    } catch (e: any) {
      setTestStatus('error')
      setTestMsg(e.message || 'Erro ao conectar')
    }
  }

  function handleSave() {
    if (!nome || !url || !key) return
    const cleanUrl = url.replace(/\/$/, '')
    const cleanKey = key.trim()

    if (editId) {
      atualizar(editId, { nome, supabaseUrl: cleanUrl, supabaseKey: cleanKey })
    } else {
      const nova = adicionar({ nome, supabaseUrl: cleanUrl, supabaseKey: cleanKey })
      selecionar(nova.id)
    }
    resetForm()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">Lojas</h1>
          <p className="page-subtitle">Gerencie as lojas conectadas ao painel</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}
        >
          <Plus size={16} />
          Nova Loja
        </button>
      </div>

      {lojas.length === 0 && !showForm && (
        <div className="gradient-card">
          <div className="empty-state py-16">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
              <Store size={36} style={{ color: '#667eea' }} />
            </div>
            <p className="text-[16px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Nenhuma loja cadastrada</p>
            <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>Adicione sua primeira loja para comecar a visualizar dados</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}
            >
              <Plus size={16} />
              Adicionar Loja
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="gradient-card p-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {editId ? 'Editar Loja' : 'Nova Loja'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nome da Loja</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Matriz, Filial 1..."
                className="search-input"
                style={{ paddingLeft: '16px' }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Supabase URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxx.supabase.co"
                className="search-input"
                style={{ paddingLeft: '16px' }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Supabase Anon Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                className="search-input"
                style={{ paddingLeft: '16px' }}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleTest}
                disabled={testStatus === 'testing'}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                style={{
                  background: testStatus === 'ok' ? 'rgba(56, 239, 125, 0.1)' : testStatus === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
                  color: testStatus === 'ok' ? '#38ef7d' : testStatus === 'error' ? '#f87171' : 'var(--text-muted)',
                  border: `1px solid ${testStatus === 'ok' ? 'rgba(56, 239, 125, 0.3)' : testStatus === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'}`,
                }}
              >
                {testStatus === 'testing' ? 'Testando...' : testStatus === 'ok' ? 'Conectado!' : 'Testar Conexao'}
              </button>
              {testMsg && testStatus !== 'testing' && (
                <span className="text-[12px] font-medium" style={{ color: testStatus === 'ok' ? '#38ef7d' : '#f87171' }}>
                  {testMsg}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button onClick={resetForm} className="px-5 py-2.5 rounded-xl text-[13px] font-medium" style={{ color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!nome || !url || !key}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  background: nome && url && key ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--bg-surface)',
                  color: nome && url && key ? 'white' : 'var(--text-muted)',
                  opacity: nome && url && key ? 1 : 0.5,
                }}
              >
                {editId ? 'Salvar Alteracoes' : 'Adicionar Loja'}
              </button>
            </div>
          </div>
        </div>
      )}

      {lojas.length > 0 && (
        <div className="space-y-3">
          {lojas.map((loja, i) => {
            const isActive = lojaAtiva?.id === loja.id
            return (
              <div
                key={loja.id}
                className="gradient-card p-5 transition-all duration-300"
                style={{
                  animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`,
                  opacity: 0,
                  borderColor: isActive ? 'rgba(102, 126, 234, 0.4)' : undefined,
                  boxShadow: isActive ? '0 0 30px rgba(102, 126, 234, 0.1)' : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <Store size={20} style={{ color: isActive ? 'white' : 'var(--text-muted)' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{loja.nome}</p>
                        {isActive && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(56, 239, 125, 0.1)', color: '#38ef7d', border: '1px solid rgba(56, 239, 125, 0.2)' }}>
                            <Check size={10} /> ATIVA
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {loja.supabaseUrl.replace('https://', '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => selecionar(loja.id)}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                        style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.2)' }}
                      >
                        Selecionar
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(loja)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Remover esta loja?')) remover(loja.id) }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ color: '#f87171' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {lojas.length > 0 && (
        <div className="gradient-card p-5">
          <h3 className="section-title">Como funciona</h3>
          <div className="space-y-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            <p>Cada loja precisa ter seu proprio projeto Supabase. O desktop ClickUpVendas sincroniza os dados automaticamente para o Supabase da loja.</p>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Para adicionar uma nova loja:</p>
              <ol className="space-y-1 ml-4 list-decimal" style={{ color: 'var(--text-muted)' }}>
                <li>Crie um projeto no Supabase (supabase.com)</li>
                <li>Execute o SQL de criacao das tabelas no novo projeto</li>
                <li>Cole a URL e a Anon Key do projeto aqui</li>
                <li>No desktop ClickUpVendas, configure a URL e Key do Supabase</li>
                <li>Ative o sync em Configuracoes &gt; Sync Nuvem</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
