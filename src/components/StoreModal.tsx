import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, X, Database, Check, RefreshCw, Layers } from 'lucide-react';

export const StoreModal: React.FC = () => {
  const { isStoreModalOpen, setIsStoreModalOpen, activeStore, updateStoreConfig, addStore, showToast } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [storeName, setStoreName] = useState(activeStore?.name || 'Loja Principal');
  const [cnpj, setCnpj] = useState(activeStore?.cnpj || '12.345.678/0001-90');
  const [supabaseUrl, setSupabaseUrl] = useState(activeStore?.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(activeStore?.supabaseAnonKey || '');
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isStoreModalOpen) return null;

  const handleSaveDemo = () => {
    if (activeStore) {
      updateStoreConfig(activeStore.id, {
        name: storeName,
        cnpj,
        isConnected: true
      });
    } else {
      addStore({
        name: storeName,
        cnpj,
        isConnected: true
      });
    }
    showToast('Loja configurada e ativada com sucesso!');
    setIsStoreModalOpen(false);
  };

  const handleConnectSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      if (activeStore) {
        updateStoreConfig(activeStore.id, {
          name: storeName,
          cnpj,
          supabaseUrl,
          supabaseAnonKey: supabaseKey,
          isConnected: true
        });
      } else {
        addStore({
          name: storeName,
          cnpj,
          supabaseUrl,
          supabaseAnonKey: supabaseKey,
          isConnected: true
        });
      }
      showToast('Conexão Supabase configurada com sucesso!');
      setIsStoreModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsStoreModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
          <Store className="w-10 h-10 text-sky-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {activeStore?.isConnected ? 'Configurar Sua Loja' : 'Nenhuma loja configurada'}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-xs">
          Adicione os dados do Supabase da sua loja para visualizar as vendas e o estoque em tempo real.
        </p>

        {!showAdvanced ? (
          <div className="w-full space-y-3">
            <button
              onClick={() => setShowAdvanced(true)}
              className="w-full py-3 bg-[#38a9e4] hover:bg-[#2b96d1] text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <Store className="w-5 h-5" />
              <span>Configurar Primeira Loja</span>
            </button>

            <button
              onClick={handleSaveDemo}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Usar Banco Demonstrativo em Tempo Real
            </button>
          </div>
        ) : (
          <form onSubmit={handleConnectSupabase} className="w-full text-left space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Loja
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                placeholder="Ex: ClickUp Vendas - Matriz"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={e => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Supabase Project URL</span>
                <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Supabase Anon API Key</span>
                <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={e => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isConnecting}
                className="flex-1 py-2.5 bg-[#38a9e4] hover:bg-[#2b96d1] text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvar e Conectar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
