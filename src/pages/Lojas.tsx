import { useState } from 'react'
import { Store, Plus, Trash2, Edit3, X } from 'lucide-react'
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
    setTestMsg('Testando conexão...')
    try {
      const testClient = (await import('@supabase/supabase-js')).createClient(url, key, { auth: { persistSession: false } })
      const { error } = await testClient.from('produtos').select('id').limit(1)
      if (error) throw error
      setTestStatus('ok')
      setTestMsg('Conexão OK!')
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

  const inputStyle = 'w-full bg-white border border-[#e8eaed] rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#3bafda] focus:ring-2 focus:ring-[#3bafda]/10 transition-all'
  const labelStyle = 'block text-[12px] font-medium text-[#636e72] mb-1.5'

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-[#e8eaed]">
        <div>
          <h1 className="page-title">Lojas Cadastradas</h1>
          <p className="page-subtitle">Gerencie as instâncias conectadas ao painel gerencial.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3bafda] hover:bg-[#2fa3c9] text-white text-[13px] font-medium transition-colors shadow-sm"
          >
            <Plus size={15} />
            Nova Loja
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-[#e8eaed] rounded-xl p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#e8eaed]">
            <h3 className="text-[15px] font-semibold text-[#2d3436]">
              {editId ? 'Editar Loja' : 'Cadastrar Nova Loja'}
            </h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#2d3436] hover:bg-[#f0f2f5] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelStyle}>Nome da Loja</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Matriz Centro, Filial Norte..." className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Supabase URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xxxxx.supabase.co" className={`${inputStyle} font-mono text-[12px]`} />
            </div>
            <div>
              <label className={labelStyle}>Supabase Anon Key</label>
              <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." className={`${inputStyle} font-mono text-[12px]`} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTest}
                disabled={testStatus === 'testing'}
                className={`px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  testStatus === 'ok' ? 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]' :
                  testStatus === 'error' ? 'bg-[#ffebee] border-[#ffcdd2] text-[#c62828]' :
                  'bg-white border-[#e8eaed] text-[#636e72] hover:bg-[#f5f7fa]'
                }`}
              >
                {testStatus === 'testing' ? 'Testando...' : testStatus === 'ok' ? '✓ Conexão OK' : testStatus === 'error' ? '✕ Falhou' : 'Testar Conexão'}
              </button>
              {testMsg && testStatus !== 'testing' && testStatus !== 'ok' && (
                <span className="text-[11px] text-[#c62828]">{testMsg}</span>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e8eaed]">
              <button onClick={resetForm} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#636e72] bg-[#f5f7fa] hover:bg-[#e8eaed] transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!nome || !url || !key}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#3bafda] hover:bg-[#2fa3c9] text-white disabled:opacity-40 transition-colors shadow-sm"
              >
                {editId ? 'Salvar Alterações' : 'Adicionar Loja'}
              </button>
            </div>
          </div>
        </div>
      )}

      {lojas.length === 0 && !showForm ? (
        <div className="bg-white border border-[#e8eaed] rounded-xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-[#e3f2fd] flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-[#1565c0]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#2d3436] mb-1">Nenhuma loja cadastrada</h3>
          <p className="text-[13px] text-[#9ca3af] mb-5 max-w-sm mx-auto">Adicione a URL e a chave do Supabase para monitorar vendas e estoque.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3bafda] hover:bg-[#2fa3c9] text-white text-[13px] font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            Cadastrar Primeira Loja
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lojas.map((loja) => {
            const isActive = lojaAtiva?.id === loja.id
            return (
              <div
                key={loja.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all bg-white shadow-sm ${
                  isActive ? 'border-[#3bafda] ring-2 ring-[#3bafda]/10' : 'border-[#e8eaed] hover:border-[#d1d5db]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#3bafda] text-white' : 'bg-[#f5f7fa] text-[#9ca3af]'}`}>
                    <Store size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-semibold text-[#2d3436]">{loja.nome}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e8f5e9] text-[#2e7d32]">
                          Ativa
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#9ca3af] font-mono mt-0.5">{loja.supabaseUrl}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => selecionar(loja.id)}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#636e72] bg-[#f5f7fa] hover:bg-[#e8eaed] border border-[#e8eaed] transition-colors"
                    >
                      Selecionar
                    </button>
                  )}
                  <button onClick={() => startEdit(loja)} className="p-2 rounded-lg text-[#9ca3af] hover:text-[#2d3436] hover:bg-[#f5f7fa] transition-colors" title="Editar">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => { if (confirm('Remover esta loja?')) remover(loja.id) }} className="p-2 rounded-lg text-[#9ca3af] hover:text-[#c62828] hover:bg-[#ffebee] transition-colors" title="Remover">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white border border-[#e8eaed] rounded-xl p-5 shadow-sm text-[13px]">
        <h4 className="font-semibold text-[#2d3436] mb-2">Como integrar uma nova loja:</h4>
        <ol className="list-decimal list-inside space-y-1 text-[#9ca3af] text-[12px]">
          <li>Abra o aplicativo desktop ClickUpVendas instalado na loja.</li>
          <li>Vá em Configurações &gt; Sincronização Nuvem e insira as credenciais do Supabase.</li>
          <li>Cadastre o mesmo projeto Supabase aqui no painel gerencial.</li>
        </ol>
      </div>
    </div>
  )
}
