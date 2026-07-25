import { useEffect, useState } from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { obterConfiguracoes, salvarConfiguracoes, type Configuracoes } from '../api'

export default function Configuracoes() {
  const [config, setConfig] = useState<Configuracoes | null>(null)
  const [form, setForm] = useState({
    RazaoSocial: '',
    NomeFantasia: '',
    CNPJ: '',
    Endereco: '',
    Telefone: '',
    Email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadConfig() }, [])

  async function loadConfig() {
    try {
      const res = await obterConfiguracoes()
      setConfig(res.data)
      setForm({
        RazaoSocial: res.data.RazaoSocial || '',
        NomeFantasia: res.data.NomeFantasia || '',
        CNPJ: res.data.CNPJ || '',
        Endereco: res.data.Endereco || '',
        Telefone: res.data.Telefone || '',
        Email: res.data.Email || '',
      })
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await salvarConfiguracoes({ ...(config ? { ID: config.ID } : {}), ...form })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      loadConfig()
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary)' }} /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <SettingsIcon size={24} style={{ color: 'var(--primary)' }} />
        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Configuracoes da Empresa</h2>
      </div>

      <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Razao Social</label>
            <input
              value={form.RazaoSocial}
              onChange={(e) => setForm({ ...form, RazaoSocial: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Nome Fantasia</label>
              <input
                value={form.NomeFantasia}
                onChange={(e) => setForm({ ...form, NomeFantasia: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>CNPJ</label>
              <input
                value={form.CNPJ}
                onChange={(e) => setForm({ ...form, CNPJ: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Endereco</label>
            <input
              value={form.Endereco}
              onChange={(e) => setForm({ ...form, Endereco: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Telefone</label>
              <input
                value={form.Telefone}
                onChange={(e) => setForm({ ...form, Telefone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Email</label>
              <input
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
          {saved && (
            <span className="text-sm font-medium" style={{ color: '#22c55e' }}>Salvo com sucesso!</span>
          )}
        </div>
      </div>
    </div>
  )
}
