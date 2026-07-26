import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Search } from 'lucide-react';

export const FornecedoresView: React.FC = () => {
  const { fornecedores } = useApp();
  const [search, setSearch] = React.useState('');

  const filtered = fornecedores.filter(f =>
    f.nome?.toLowerCase().includes(search.toLowerCase()) ||
    f.cnpj?.includes(search) ||
    f.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-sky-500" />
            <span>Fornecedores</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{fornecedores.length} fornecedores cadastrados</p>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, CNPJ ou categoria..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nome</th>
                <th className="py-3.5 px-4">CNPJ</th>
                <th className="py-3.5 px-4">Contato</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400">Nenhum fornecedor encontrado</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{f.nome}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{f.cnpj}</td>
                  <td className="py-3.5 px-4 text-slate-600">{f.contato}</td>
                  <td className="py-3.5 px-4 text-slate-600">{f.categoria}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${f.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {f.status}
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
