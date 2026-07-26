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

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Lojas Cadastradas</h1>
          <p className="text-[13px] text-[#71717a]">Gerencie as instâncias conectadas ao painel gerencial.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium transition-colors shadow-sm"
          >
            <Plus size={15} />
            Nova Loja
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#27272a]">
            <h3 className="text-[15px] font-semibold text-white">
              {editId ? 'Editar Loja' : 'Cadastrar Nova Loja'}
            </h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-[#27272a]">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">Nome da Loja</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Matriz Centro, Filial Norte..."
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">Supabase URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxx.supabase.co"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#a1a1aa] mb-1.5">Supabase Anon Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTest}
                disabled={testStatus === 'testing'}
                className={`px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  testStatus === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  testStatus === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                  'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
                }`}
              >
                {testStatus === 'testing' ? 'Testando conexão...' : testStatus === 'ok' ? '✓ Conexão bem-sucedida' : testStatus === 'error' ? '✕ Falha na conexão' : 'Testar Conexão'}
              </button>
              {testMsg && testStatus !== 'testing' && testStatus !== 'ok' && (
                <span className="text-[11px] text-rose-400">{testMsg}</span>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#27272a]">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#a1a1aa] hover:text-white bg-[#18181b] border border-[#27272a]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!nome || !url || !key}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-sm"
              >
                {editId ? 'Salvar Alterações' : 'Adicionar Loja'}
              </button>
            </div>
          </div>
        </div>
      )}

      {lojas.length === 0 && !showForm ? (
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Store size={22} />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Nenhuma loja cadastrada</h3>
          <p className="text-[13px] text-[#71717a] mb-6 max-w-sm mx-auto">Adicione a URL e a chave do Supabase da sua loja para comecar a monitorar vendas e estoque.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium transition-colors shadow-sm"
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
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isActive ? 'bg-[#121215] border-indigo-500/50 shadow-lg shadow-indigo-500/5' : 'bg-[#121215]/50 border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white' : 'bg-[#18181b] text-[#71717a]'}`}>
                    <Store size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-semibold text-white">{loja.nome}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          Ativa
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#71717a] font-mono mt-0.5">{loja.supabaseUrl}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => selecionar(loja.id)}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#18181b] hover:bg-[#27272a] text-white border border-[#27272a] transition-colors"
                    >
                      Selecionar
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(loja)}
                    className="p-2 rounded-lg text-[#71717a] hover:text-white hover:bg-[#18181b] transition-colors"
                    title="Editar"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => { if (confirm('Remover esta loja?')) remover(loja.id) }}
                    className="p-2 rounded-lg text-[#71717a] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 text-[13px] text-[#a1a1aa] space-y-3">
        <h4 className="font-semibold text-white">Como integrar uma nova loja:</h4>
        <ol className="list-decimal list-inside space-y-1 text-[#71717a] text-[12px]">
          <li>Abra o aplicativo desktop ClickUpVendas instalado na loja.</li>
          <li>Va em Configurações &gt; Sincronização Nuvem e insira as credenciais do Supabase.</li>
          <li>Cadastre o mesmo projeto Supabase aqui no painel gerencial.</li>
        </ol>
      </div>
    </div>
  )
}
