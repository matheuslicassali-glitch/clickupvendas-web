import { useState } from 'react'
import { Store, Plus, Trash2, Check, Edit3, X } from 'lucide-react'
import { useStore } from '../contexts/StoreContext'
import type { Loja } from '../lib/supabase'

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #111827, #0f172a)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '18px',
  padding: '24px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0c1425',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: '#f1f5f9',
  fontSize: '13px',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.2s',
}

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
    <div className="space-y-6 animate-fade-in">
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
        <div style={cardStyle}>
          <div className="empty-state py-16">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'rgba(102, 126, 234, 0.15)' }}>
              <Store size={36} style={{ color: '#667eea' }} />
            </div>
            <p className="text-[16px] font-bold mb-2" style={{ color: '#f1f5f9' }}>Nenhuma loja cadastrada</p>
            <p className="text-[13px] mb-6" style={{ color: '#64748b' }}>Adicione sua primeira loja para comecar a visualizar dados</p>
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
        <div style={{ ...cardStyle, animation: 'fadeIn 0.3s ease-out' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold" style={{ color: '#f1f5f9' }}>
              {editId ? 'Editar Loja' : 'Nova Loja'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg" style={{ color: '#64748b', background: 'rgba(255,255,255,0.05)' }}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold mb-2" style={{ color: '#94a3b8' }}>Nome da Loja</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Matriz, Filial 1..."
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-2" style={{ color: '#94a3b8' }}>Supabase URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxx.supabase.co"
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-2" style={{ color: '#94a3b8' }}>Supabase Anon Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleTest}
                disabled={testStatus === 'testing'}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                style={{
                  background: testStatus === 'ok' ? 'rgba(56, 239, 125, 0.1)' : testStatus === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                  color: testStatus === 'ok' ? '#38ef7d' : testStatus === 'error' ? '#f87171' : '#94a3b8',
                  border: `1px solid ${testStatus === 'ok' ? 'rgba(56, 239, 125, 0.3)' : testStatus === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'}`,
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

            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!nome || !url || !key}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  background: nome && url && key ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.05)',
                  color: nome && url && key ? 'white' : '#64748b',
                  opacity: nome && url && key ? 1 : 0.5,
                  border: '1px solid rgba(255,255,255,0.1)',
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
                style={{
                  ...cardStyle,
                  borderColor: isActive ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255,255,255,0.1)',
                  boxShadow: isActive ? '0 0 30px rgba(102, 126, 234, 0.15)' : 'none',
                  animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <Store size={20} style={{ color: isActive ? 'white' : '#64748b' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold" style={{ color: '#f1f5f9' }}>{loja.nome}</p>
                        {isActive && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(56, 239, 125, 0.1)', color: '#38ef7d', border: '1px solid rgba(56, 239, 125, 0.2)' }}>
                            <Check size={10} /> ATIVA
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] font-medium" style={{ color: '#64748b', fontFamily: 'monospace' }}>
                        {loja.supabaseUrl.replace('https://', '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => selecionar(loja.id)}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                        style={{ background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' }}
                      >
                        Selecionar
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(loja)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Remover esta loja?')) remover(loja.id) }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)' }}
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
        <div style={cardStyle}>
          <h3 className="section-title">Como funciona</h3>
          <div className="space-y-3 text-[13px]" style={{ color: '#94a3b8' }}>
            <p>Cada loja precisa ter seu proprio projeto Supabase. O desktop ClickUpVendas sincroniza os dados automaticamente para o Supabase da loja.</p>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-semibold mb-2" style={{ color: '#f1f5f9' }}>Para adicionar uma nova loja:</p>
              <ol className="space-y-1 ml-4 list-decimal" style={{ color: '#64748b' }}>
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
