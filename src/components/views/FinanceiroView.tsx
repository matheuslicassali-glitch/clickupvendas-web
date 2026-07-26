import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export const FinanceiroView: React.FC = () => {
  const { financeiro, vendas, periodo, setPeriodo } = useApp();

  const totalReceitas = financeiro.filter(f => f.tipo === 'Receita' && f.status === 'Pago').reduce((a, f) => a + (f.valor || 0), 0);
  const totalDespesas = financeiro.filter(f => f.tipo === 'Despesa' && f.status === 'Pago').reduce((a, f) => a + (f.valor || 0), 0);
  const pendenteReceber = financeiro.filter(f => f.tipo === 'Receita' && f.status === 'Pendente').reduce((a, f) => a + (f.valor || 0), 0);
  const pendentePagar = financeiro.filter(f => f.tipo === 'Despesa' && f.status === 'Pendente').reduce((a, f) => a + (f.valor || 0), 0);
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-sky-500" />
            <span>Financeiro</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Contas a pagar, receber e saldo</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receitas Pagas</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-emerald-600">R$ {totalReceitas.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Despesas Pagas</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><TrendingDown className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-rose-600">R$ {totalDespesas.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">A Receber</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-sky-600">R$ {pendenteReceber.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">A Pagar</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-amber-600">R$ {pendentePagar.toFixed(2)}</h3></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Lançamentos Financeiros</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Vencimento</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {financeiro.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">Nenhum lançamento</td></tr>
              ) : financeiro.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{f.descricao}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.tipo === 'Receita' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{f.tipo}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{f.categoria}</td>
                  <td className="py-3.5 px-4 text-slate-600">{new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${f.status === 'Pago' ? 'bg-emerald-50 text-emerald-700' : f.status === 'Atrasado' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{f.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">R$ {(f.valor || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
