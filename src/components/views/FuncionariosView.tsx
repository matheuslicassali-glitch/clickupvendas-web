import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, TrendingUp } from 'lucide-react';

export const FuncionariosView: React.FC = () => {
  const { funcionarios, vendas, periodo, setPeriodo } = useApp();

  const vendasPorVendedor = vendas.reduce((acc: Record<string, { count: number; total: number }>, v) => {
    if (!acc[v.vendedor_nome]) acc[v.vendedor_nome] = { count: 0, total: 0 };
    acc[v.vendedor_nome].count++;
    acc[v.vendedor_nome].total += v.total || 0;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-sky-500" />
            <span>Funcionários & Desempenho</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{funcionarios.length} funcionários cadastrados</p>
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
        {funcionarios.map(f => {
          const stats = vendasPorVendedor[f.nome] || { count: 0, total: 0 };
          return (
            <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                  {f.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{f.nome}</h3>
                  <p className="text-[11px] text-slate-500">{f.cargo}</p>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${f.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {f.status}
                </span>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Vendas no Período</span>
                  <span className="font-bold text-slate-800">{stats.count}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Faturamento</span>
                  <span className="font-bold text-emerald-600">R$ {stats.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
        {funcionarios.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs text-center text-slate-400 text-sm">
            Nenhum funcionário encontrado
          </div>
        )}
      </div>

      {Object.keys(vendasPorVendedor).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              Ranking de Vendas por Vendedor
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Vendedor</th>
                  <th className="py-3.5 px-4 text-right">Vendas</th>
                  <th className="py-3.5 px-4 text-right">Faturamento</th>
                  <th className="py-3.5 px-4 text-right">Ticket Médio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Object.entries(vendasPorVendedor)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([nome, stats], i) => (
                    <tr key={nome} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-400">{i + 1}º</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{nome}</td>
                      <td className="py-3.5 px-4 text-right">{stats.count}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">R$ {stats.total.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-right text-slate-600">R$ {(stats.count > 0 ? stats.total / stats.count : 0).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
