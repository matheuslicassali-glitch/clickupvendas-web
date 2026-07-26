import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Produto } from '../../types';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  X,
  PlusCircle,
  Tag
} from 'lucide-react';

export const EstoqueView: React.FC = () => {
  const { produtos, addProduto, updateProduto, deleteProduto, fornecedores } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  // Form State
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Alimentício');
  const [precoVenda, setPrecoVenda] = useState(10);
  const [precoCusto, setPrecoCusto] = useState(5);
  const [estoqueAtual, setEstoqueAtual] = useState(20);
  const [estoqueMinimo, setEstoqueMinimo] = useState(5);
  const [unidade, setUnidade] = useState('UN');
  const [fornecedorId, setFornecedorId] = useState('');

  const openNewModal = () => {
    setEditingProduto(null);
    setCodigo(`7891000${Math.floor(1000 + Math.random() * 9000)}`);
    setNome('');
    setCategoria('Alimentício');
    setPrecoVenda(15.0);
    setPrecoCusto(8.0);
    setEstoqueAtual(20);
    setEstoqueMinimo(5);
    setUnidade('UN');
    setFornecedorId(fornecedores[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Produto) => {
    setEditingProduto(p);
    setCodigo(p.codigo);
    setNome(p.nome);
    setCategoria(p.categoria);
    setPrecoVenda(p.precoVenda);
    setPrecoCusto(p.precoCusto);
    setEstoqueAtual(p.estoqueAtual);
    setEstoqueMinimo(p.estoqueMinimo);
    setUnidade(p.unidade);
    setFornecedorId(p.fornecedorId || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selFornecedor = fornecedores.find((f) => f.id === fornecedorId);

    if (editingProduto) {
      updateProduto(editingProduto.id, {
        codigo,
        nome,
        categoria,
        precoVenda: Number(precoVenda),
        precoCusto: Number(precoCusto),
        estoqueAtual: Number(estoqueAtual),
        estoqueMinimo: Number(estoqueMinimo),
        unidade,
        fornecedorId,
        fornecedorNome: selFornecedor?.nome
      });
    } else {
      addProduto({
        codigo,
        nome,
        categoria,
        precoVenda: Number(precoVenda),
        precoCusto: Number(precoCusto),
        estoqueAtual: Number(estoqueAtual),
        estoqueMinimo: Number(estoqueMinimo),
        unidade,
        fornecedorId,
        fornecedorNome: selFornecedor?.nome
      });
    }
    setIsModalOpen(false);
  };

  const filtered = produtos.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.includes(searchTerm) ||
      (p.fornecedorNome && p.fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'todas' || p.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-500" />
            <span>Controle de Estoque & Produtos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie preços, margem de lucro e alertas de reposição mínima.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 bg-[#38a9e4] hover:bg-[#2c98d1] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Produto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por produto, código ou fornecedor..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['todas', 'Bebidas', 'Alimentício', 'Vestuário', 'Eletrônicos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'todas' ? 'Todas Categorias' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Código / Produto</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Preço Custo</th>
                <th className="py-3.5 px-4">Preço Venda</th>
                <th className="py-3.5 px-4">Margem</th>
                <th className="py-3.5 px-4">Estoque Atual</th>
                <th className="py-3.5 px-4">Fornecedor</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => {
                const margem =
                  prod.precoCusto > 0
                    ? ((prod.precoVenda - prod.precoCusto) / prod.precoCusto) * 100
                    : 0;
                const isLowStock = prod.estoqueAtual <= prod.estoqueMinimo;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>
                        <span className="block font-bold text-slate-800">{prod.nome}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prod.codigo}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {prod.categoria}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      R$ {prod.precoCusto.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      R$ {prod.precoVenda.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      +{margem.toFixed(0)}%
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isLowStock
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {prod.estoqueAtual} {prod.unidade}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {prod.fornecedorNome || 'Não vinculado'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduto(prod.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                {editingProduto ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Código de Barras EAN
                  </label>
                  <input
                    type="text"
                    required
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Bebidas">Bebidas</option>
                    <option value="Alimentício">Alimentício</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Diversos">Diversos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Refrigerante Cola 2L"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço de Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={precoCusto}
                    onChange={(e) => setPrecoCusto(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-xs text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estoque Inicial / Atual
                  </label>
                  <input
                    type="number"
                    required
                    value={estoqueAtual}
                    onChange={(e) => setEstoqueAtual(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estoque Mínimo (Alerta)
                  </label>
                  <input
                    type="number"
                    required
                    value={estoqueMinimo}
                    onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fornecedor Homologado
                </label>
                <select
                  value={fornecedorId}
                  onChange={(e) => setFornecedorId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="">Nenhum fornecedor vinculado</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome} ({f.cnpj})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg"
                >
                  {editingProduto ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
