import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, AlertTriangle } from 'lucide-react';

export const EstoqueView: React.FC = () => {
  const { produtos, periodo, setPeriodo } = useApp();
  const [search, setSearch] = React.useState('');

  const filtered = produtos.filter(p =>
    p.nome?.toLowerCase().includes(search.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  const alerta = filtered.filter(p => p.estoque_atual <= p.estoque_minimo);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-500" />
            <span>Estoque & Produtos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{produtos.length} produtos cadastrados • {alerta.length} em alerta</p>
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

      {alerta.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-800">Produtos com Estoque Baixo</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {alerta.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-white/60 text-xs">
                <span className="font-medium text-amber-900">{p.nome}</span>
                <span className="font-bold text-amber-700">{p.estoque_atual} / {p.estoque_minimo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative w-full sm:w-80">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Produto</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4 text-right">Preço</th>
                <th className="py-3.5 px-4 text-right">Estoque</th>
                <th className="py-3.5 px-4 text-right">Mínimo</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">Nenhum produto encontrado</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{p.codigo}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.nome}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.categoria}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">R$ {(p.preco_venda || 0).toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">{p.estoque_atual}</td>
                  <td className="py-3.5 px-4 text-right text-slate-500">{p.estoque_minimo}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${p.estoque_atual <= p.estoque_minimo ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.estoque_atual <= p.estoque_minimo ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {p.estoque_atual <= p.estoque_minimo ? 'Baixo' : 'Normal'}
                    </span>
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
