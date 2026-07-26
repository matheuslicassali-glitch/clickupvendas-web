import { useEffect, useState } from 'react'
import { Building2, MapPin, Phone, Mail } from 'lucide-react'
import { obterConfiguracoes, type Configuracoes } from '../api/supabase-api'
import { useStore } from '../contexts/StoreContext'

export default function Configuracoes() {
  const { lojaAtiva } = useStore()
  const [config, setConfig] = useState<Configuracoes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (lojaAtiva) loadConfig(); else setLoading(false) }, [lojaAtiva?.id])

  async function loadConfig() {
    setLoading(true)
    try { const res = await obterConfiguracoes(); setConfig(res.data) } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="loading-spinner" /></div>

  const fields = [
    { label: 'Razao Social', value: config?.RazaoSocial || '-', icon: Building2 },
    { label: 'Nome Fantasia', value: config?.NomeFantasia || '-', icon: Building2 },
    { label: 'CNPJ', value: config?.CNPJ || '-', icon: Building2 },
    { label: 'Endereco', value: config?.Endereco || '-', icon: MapPin },
    { label: 'Telefone', value: config?.Telefone || '-', icon: Phone },
    { label: 'Email', value: config?.Email || '-', icon: Mail },
  ]

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Configuracoes</h1>
          <p className="page-subtitle">Dados da empresa (somente leitura)</p>
        </div>
      </div>

      <div className="gradient-card p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((field, i) => {
            const Icon = field.icon
            return (
              <div key={field.label} className="p-4 rounded-xl transition-all hover:bg-[#f0f2f5]" style={{ background: 'var(--bg-surface)', animation: `fadeIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>
                    <Icon size={16} style={{ color: 'var(--accent-blue)' }} />
                  </div>
                  <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>{field.label}</p>
                </div>
                <p className="text-[15px] font-medium ml-11" style={{ color: 'var(--text-primary)' }}>{field.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
