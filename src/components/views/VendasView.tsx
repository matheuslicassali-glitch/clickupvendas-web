import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Search } from 'lucide-react';

export const VendasView: React.FC = () => {
  const { vendas, periodo, setPeriodo } = useApp();
  const [search, setSearch] = React.useState('');

  const filtered = vendas.filter(v =>
    v.codigo?.toLowerCase().includes(search.toLowerCase()) ||
    v.cliente_nome?.toLowerCase().includes(search.toLowerCase()) ||
    v.vendedor_nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-sky-500" />
            <span>Vendas Realizadas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Histórico completo de vendas por período</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['hoje', 'semana', 'mes'] as const).map(p => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${periodo === p ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-800'}`}>
              {p === 'hoje' ? 'Hoje' : p === 'semana' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código, cliente ou vendedor..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Data/Hora</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Vendedor</th>
                <th className="py-3.5 px-4">Pagamento</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">Nenhuma venda encontrada</td></tr>
              ) : filtered.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{v.codigo}</td>
                  <td className="py-3.5 px-4 text-slate-600">{new Date(v.data).toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{v.cliente_nome}</td>
                  <td className="py-3.5 px-4 text-slate-600">{v.vendedor_nome}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700">{v.forma_pagamento}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${v.status === 'Concluída' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : v.status === 'Cancelada' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'Concluída' ? 'bg-emerald-500' : v.status === 'Cancelada' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">R$ {(v.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
