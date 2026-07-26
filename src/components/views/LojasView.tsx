import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Store, Check, RefreshCw, Link as LinkIcon, Database } from 'lucide-react';

export const LojasView: React.FC = () => {
  const { stores, activeStoreId, setActiveStoreId, setIsStoreModalOpen, showToast } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-500" />
            <span>Gerenciamento de Lojas & Conexões</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie múltiplas unidades, filiais e sincronização de dados via Supabase / PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setIsStoreModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Configurar Nova Loja</span>
        </button>
      </div>

      {/* Stores List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stores.map((s) => {
          const isActive = s.id === activeStoreId;

          return (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-sky-400 shadow-md ring-2 ring-sky-500/10'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{s.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400">
                        CNPJ: {s.cnpj || 'Não informado'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      s.isConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.isConnected ? 'Sincronizado' : 'Modo Offline'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                  <p>
                    <b>Endereço:</b> {s.address || 'São Paulo, SP'}
                  </p>
                  <p className="truncate">
                    <b>Supabase URL:</b>{' '}
                    <span className="font-mono text-slate-500 text-[11px]">
                      {s.supabaseUrl || 'Banco Local Ativo'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {isActive ? (
                  <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Loja Ativa Atualmente
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setActiveStoreId(s.id);
                      showToast(`Alternado para a loja "${s.name}"`);
                    }}
                    className="text-xs font-bold text-slate-700 hover:text-sky-600 cursor-pointer"
                  >
                    Alternar para esta Loja &rarr;
                  </button>
                )}

                <button
                  onClick={() => setIsStoreModalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
