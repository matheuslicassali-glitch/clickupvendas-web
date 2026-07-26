import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Fornecedor } from '../../types';
import {
  Store,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Edit,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  X,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';

export const FornecedoresView: React.FC = () => {
  const { fornecedores, addFornecedor, updateFornecedor, deleteFornecedor, produtos } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [viewingFornecedor, setViewingFornecedor] = useState<Fornecedor | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contato, setContato] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [categoria, setCategoria] = useState('Bebidas e Mantimentos');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('Terça-feira');
  const [endereco, setEndereco] = useState('');

  const openNewModal = () => {
    setEditingFornecedor(null);
    setNome('');
    setCnpj('');
    setContato('');
    setEmail('');
    setTelefone('');
    setCategoria('Bebidas e Mantimentos');
    setStatus('Ativo');
    setPrevisaoEntrega('Terça-feira');
    setEndereco('');
    setIsModalOpen(true);
  };

  const openEditModal = (forn: Fornecedor) => {
    setEditingFornecedor(forn);
    setNome(forn.nome);
    setCnpj(forn.cnpj);
    setContato(forn.contato);
    setEmail(forn.email);
    setTelefone(forn.telefone);
    setCategoria(forn.categoria);
    setStatus(forn.status);
    setPrevisaoEntrega(forn.previsaoEntrega || '');
    setEndereco(forn.endereco || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFornecedor) {
      updateFornecedor(editingFornecedor.id, {
        nome,
        cnpj,
        contato,
        email,
        telefone,
        categoria,
        status,
        previsaoEntrega,
        endereco
      });
    } else {
      addFornecedor({
        nome,
        cnpj,
        contato,
        email,
        telefone,
        categoria,
        status,
        previsaoEntrega,
        endereco
      });
    }
    setIsModalOpen(false);
  };

  const filteredFornecedores = fornecedores.filter((f) => {
    const matchesSearch =
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cnpj.includes(searchTerm) ||
      f.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'todos' ||
      (selectedStatus === 'ativos' && f.status === 'Ativo') ||
      (selectedStatus === 'inativos' && f.status === 'Inativo');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-sky-500" />
            <span>Gestão de Fornecedores</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre, controle prazos de entrega e monitore seus parceiros comerciais.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Fornecedor</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CNPJ ou categoria..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setSelectedStatus('todos')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedStatus === 'todos'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Todos ({fornecedores.length})
          </button>
          <button
            onClick={() => setSelectedStatus('ativos')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedStatus === 'ativos'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Ativos ({fornecedores.filter((f) => f.status === 'Ativo').length})
          </button>
          <button
            onClick={() => setSelectedStatus('inativos')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedStatus === 'inativos'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Inativos ({fornecedores.filter((f) => f.status === 'Inativo').length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nome</th>
                <th className="py-3.5 px-4">CNPJ</th>
                <th className="py-3.5 px-4">Contato</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Previsão Entrega</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredFornecedores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Nenhum fornecedor encontrado.
                  </td>
                </tr>
              ) : (
                filteredFornecedores.map((forn) => {
                  const linkedProductsCount = produtos.filter(
                    (p) => p.fornecedorId === forn.id
                  ).length;

                  return (
                    <tr
                      key={forn.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Nome */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 font-bold text-xs">
                            {forn.nome.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-800">{forn.nome}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {linkedProductsCount} produto(s) associado(s)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CNPJ */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {forn.cnpj}
                      </td>

                      {/* Contato */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-medium block text-slate-800">{forn.contato}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {forn.telefone}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            forn.status === 'Ativo'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              forn.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {forn.status}
                        </span>
                      </td>

                      {/* Categoria */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {forn.categoria}
                      </td>

                      {/* Previsão Entrega */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Truck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span>{forn.previsaoEntrega || 'Sob consulta'}</span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingFornecedor(forn)}
                            title="Ver Detalhes"
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Building2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(forn)}
                            title="Editar"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteFornecedor(forn.id)}
                            title="Excluir"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastrar/Editar Fornecedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                {editingFornecedor ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Razão Social / Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Ambev S.A."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pessoa de Contato *
                  </label>
                  <input
                    type="text"
                    required
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                    placeholder="Ex: Roberto Almeida"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@fornecedor.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Bebidas e Mantimentos">Bebidas e Mantimentos</option>
                    <option value="Alimentício">Alimentício</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Insumos">Insumos e Embalagens</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Previsão habitual de entrega
                  </label>
                  <input
                    type="text"
                    value={previsaoEntrega}
                    onChange={(e) => setPrevisaoEntrega(e.target.value)}
                    placeholder="Ex: Quarta-feira (Manhã)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Ativo' | 'Inativo')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Endereço do Fornecedor
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white font-medium rounded-lg shadow-sm cursor-pointer"
                >
                  {editingFornecedor ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes Fornecedor */}
      {viewingFornecedor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-in fade-in">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-base">
                  {viewingFornecedor.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {viewingFornecedor.nome}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    CNPJ: {viewingFornecedor.cnpj}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingFornecedor(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contato Direto:</span>
                  <span className="font-semibold text-slate-800">{viewingFornecedor.contato}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Telefone:</span>
                  <span className="font-semibold text-slate-800">{viewingFornecedor.telefone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">E-mail:</span>
                  <span className="font-semibold text-slate-800">{viewingFornecedor.email || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Entrega Prevista:</span>
                  <span className="font-semibold text-sky-600">{viewingFornecedor.previsaoEntrega || 'Não informado'}</span>
                </div>
              </div>

              {viewingFornecedor.endereco && (
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{viewingFornecedor.endereco}</span>
                </div>
              )}

              {/* Linked Products */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 text-xs">
                  Produtos Fornecidos ({produtos.filter((p) => p.fornecedorId === viewingFornecedor.id).length})
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {produtos
                    .filter((p) => p.fornecedorId === viewingFornecedor.id)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <span className="font-medium text-slate-800 block">{p.nome}</span>
                          <span className="text-[10px] text-slate-400">Estoque: {p.estoqueAtual} {p.unidade}</span>
                        </div>
                        <span className="font-bold text-slate-700">R$ {p.precoVenda.toFixed(2)}</span>
                      </div>
                    ))}
                  {produtos.filter((p) => p.fornecedorId === viewingFornecedor.id).length === 0 && (
                    <p className="text-slate-400 text-center py-3">
                      Nenhum produto cadastrado para este fornecedor.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                onClick={() => setViewingFornecedor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
