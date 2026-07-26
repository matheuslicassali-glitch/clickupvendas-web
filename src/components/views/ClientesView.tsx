import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Search, Phone, Mail, MapPin, X } from 'lucide-react';

export const ClientesView: React.FC = () => {
  const { clientes, addCliente } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('São Paulo - SP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCliente({
      nome,
      cpfCnpj,
      telefone,
      email,
      cidade,
      status: 'Ativo'
    });
    setIsModalOpen(false);
    setNome('');
    setCpfCnpj('');
    setTelefone('');
    setEmail('');
  };

  const filtered = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-500" />
            <span>Base de Clientes & CRM</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe o histórico de compras, fidelidade e contatos dos seus clientes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nome ou CPF/CNPJ..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 shadow-2xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">CPF / CNPJ</th>
                <th className="py-3.5 px-4">Contato</th>
                <th className="py-3.5 px-4">Cidade / UF</th>
                <th className="py-3.5 px-4">Última Compra</th>
                <th className="py-3.5 px-4 text-right">Total Comprado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {c.nome}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {c.cpfCnpj}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                    <span className="block">{c.telefone}</span>
                    <span className="block text-[10px] text-slate-400">{c.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.cidade}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {c.ultimaCompra || 'Primeira compra'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                    R$ {c.totalComprado.toFixed(2)}
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
              <h3 className="text-sm font-bold text-slate-800">Cadastrar Cliente</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">CPF / CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
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
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cidade / UF</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
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
