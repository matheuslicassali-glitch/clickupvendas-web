import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Plus, Search, Shield, Percent, DollarSign, X } from 'lucide-react';

export const FuncionariosView: React.FC = () => {
  const { funcionarios, addFuncionario } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState<'Gerente' | 'Caixa' | 'Vendedor' | 'Estoquista'>('Caixa');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [salario, setSalario] = useState(2400);
  const [comissaoPorcentagem, setComissaoPorcentagem] = useState(2.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFuncionario({
      nome,
      cpf,
      cargo,
      telefone,
      email,
      salario: Number(salario),
      comissaoPorcentagem: Number(comissaoPorcentagem),
      status: 'Ativo'
    });
    setIsModalOpen(false);
    setNome('');
    setCpf('');
    setTelefone('');
    setEmail('');
  };

  const filtered = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-sky-500" />
            <span>Gestão de Equipe & Comissões</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre operacionais, controle cargos, comissões de vendas e acessos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Funcionário</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou cargo..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 shadow-2xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Nome</th>
                <th className="py-3.5 px-4">Cargo</th>
                <th className="py-3.5 px-4">CPF</th>
                <th className="py-3.5 px-4">Telefone</th>
                <th className="py-3.5 px-4">Comissão</th>
                <th className="py-3.5 px-4 text-right">Vendas no Mês</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div>
                      <span>{f.nome}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {f.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700">
                      {f.cargo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{f.cpf}</td>
                  <td className="py-3.5 px-4 text-slate-600">{f.telefone}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {f.comissaoPorcentagem}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                    R$ {f.totalVendasMes.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Cadastrar Funcionário</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo *</label>
                  <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Caixa">Caixa</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Estoquista">Estoquista</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefone *</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salário (R$)</label>
                  <input
                    type="number"
                    value={salario}
                    onChange={(e) => setSalario(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Comissão (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={comissaoPorcentagem}
                    onChange={(e) => setComissaoPorcentagem(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-sky-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 text-white font-bold rounded-lg"
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
