import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle,
  Clock,
  X,
  FileText
} from 'lucide-react';

export const FinanceiroView: React.FC = () => {
  const { financeiro, addTransacaoFinanceira } = useApp();

  const [filterTipo, setFilterTipo] = useState<'todos' | 'Receita' | 'Despesa'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'Receita' | 'Despesa'>('Despesa');
  const [categoria, setCategoria] = useState('Fornecedores');
  const [valor, setValor] = useState(0);
  const [dataVencimento, setDataVencimento] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [fornecedorOuCliente, setFornecedorOuCliente] = useState('');

  const totalReceitas = financeiro
    .filter((f) => f.tipo === 'Receita')
    .reduce((acc, f) => acc + f.valor, 0);

  const totalDespesas = financeiro
    .filter((f) => f.tipo === 'Despesa')
    .reduce((acc, f) => acc + f.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransacaoFinanceira({
      descricao,
      tipo,
      categoria,
      valor: Number(valor),
      dataVencimento,
      status: 'Pendente',
      fornecedorOuCliente
    });
    setIsModalOpen(false);
    setDescricao('');
    setValor(0);
    setFornecedorOuCliente('');
  };

  const filtered = financeiro.filter(
    (f) => filterTipo === 'todos' || f.tipo === filterTipo
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Total Entradas (Receitas)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mt-3">
            R$ {totalReceitas.toFixed(2)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Total Saídas (Despesas)
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mt-3">
            R$ {totalDespesas.toFixed(2)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Saldo em Caixa
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3
            className={`text-2xl font-bold mt-3 ${
              saldoLiquido >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            R$ {saldoLiquido.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTipo('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTipo === 'todos'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterTipo('Receita')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTipo === 'Receita'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterTipo('Despesa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTipo === 'Despesa'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Despesas
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lançamento</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Vencimento</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div>
                      <span>{item.descricao}</span>
                      {item.fornecedorOuCliente && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {item.fornecedorOuCliente}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.tipo === 'Receita'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.tipo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {item.categoria}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {item.dataVencimento}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {item.status === 'Pago' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold text-sm ${
                      item.tipo === 'Receita' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.tipo === 'Receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Novo Lançamento Financeiro
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Pagamento Fornecedor Ambev"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Despesa">Despesa (Saída)</option>
                    <option value="Receita">Receita (Entrada)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Fornecedores, Aluguel, Salários"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fornecedor / Cliente / Favorecido
                </label>
                <input
                  type="text"
                  value={fornecedorOuCliente}
                  onChange={(e) => setFornecedorOuCliente(e.target.value)}
                  placeholder="Nome do parceiro"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data Vencimento
                </label>
                <input
                  type="date"
                  value={dataVencimento}
                  onChange={(e) => setDataVencimento(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
