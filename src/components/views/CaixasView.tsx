import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

export const CaixasView: React.FC = () => {
  const { caixas, movimentacoes, periodo, setPeriodo } = useApp();

  const filtered = movimentacoes.filter(m => {
    const d = new Date(m.data);
    const now = new Date();
    if (periodo === 'hoje') {
      return d.toDateString() === now.toDateString();
    } else if (periodo === 'semana') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.getFullYear(), now.getMonth(), diff);
      return d >= monday;
    } else {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-500" />
            <span>Gestão de Caixas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Sessões de caixa e movimentações</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {caixas.map(cx => (
          <div key={cx.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {new Date(cx.data_abertura).toLocaleDateString('pt-BR')}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cx.status === 'Aberto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cx.status === 'Aberto' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {cx.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Abertura</span>
                <span className="font-semibold text-slate-800">R$ {(cx.saldo_inicial || 0).toFixed(2)}</span>
              </div>
              {cx.saldo_final != null && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Fechamento</span>
                  <span className="font-semibold text-slate-800">R$ {(cx.saldo_final || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Operador</span>
                <span className="font-medium text-slate-700">{cx.operador}</span>
              </div>
            </div>
          </div>
        ))}
        {caixas.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs text-center text-slate-400 text-sm">
            Nenhuma sessão de caixa encontrada
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Movimentações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Data/Hora</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4">Operador</th>
                <th className="py-3.5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">Nenhuma movimentação</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-600">{new Date(m.data).toLocaleString('pt-BR')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${m.tipo === 'Venda' || m.tipo === 'Suprimento' ? 'text-emerald-600' : m.tipo === 'Sangria' ? 'text-rose-600' : 'text-sky-600'}`}>
                      {m.tipo === 'Venda' || m.tipo === 'Suprimento' ? <ArrowUpRight className="w-3.5 h-3.5" /> : m.tipo === 'Sangria' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      {m.tipo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{m.descricao}</td>
                  <td className="py-3.5 px-4 text-slate-500">{m.operador}</td>
                  <td className={`py-3.5 px-4 text-right font-bold ${m.tipo === 'Sangria' ? 'text-rose-600' : 'text-slate-900'}`}>
                    {m.tipo === 'Sangria' ? '-' : '+'} R$ {(m.valor || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
