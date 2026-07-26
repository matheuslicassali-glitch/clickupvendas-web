import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemVenda, Venda } from '../../types';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle,
  Printer,
  X,
  User,
  Package
} from 'lucide-react';

export const VendasView: React.FC = () => {
  const { produtos, clientes, addVenda, caixa } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [cart, setCart] = useState<ItemVenda[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [clienteNome, setClienteNome] = useState('Consumidor Final');
  const [formaPagamento, setFormaPagamento] = useState<
    'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Fiado'
  >('Pix');

  const [completedVenda, setCompletedVenda] = useState<Venda | null>(null);

  // Filter products
  const categories = ['todas', ...Array.from(new Set(produtos.map((p) => p.categoria)))];

  const filteredProducts = produtos.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.includes(searchTerm);
    const matchesCat = selectedCategory === 'todas' || p.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const addToCart = (prod: typeof produtos[0]) => {
    if (prod.estoqueAtual <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.produtoId === prod.id);
      if (existing) {
        if (existing.quantidade >= prod.estoqueAtual) return prev;
        return prev.map((item) =>
          item.produtoId === prod.id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
                subtotal: (item.quantidade + 1) * item.precoUnitario
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            produtoId: prod.id,
            nome: prod.nome,
            precoUnitario: prod.precoVenda,
            quantidade: 1,
            subtotal: prod.precoVenda
          }
        ];
      }
    });
  };

  const updateCartQty = (produtoId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.produtoId === produtoId) {
            const newQty = item.quantidade + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantidade: newQty,
              subtotal: newQty * item.precoUnitario
            };
          }
          return item;
        })
        .filter(Boolean) as ItemVenda[]
    );
  };

  const removeFromCart = (produtoId: string) => {
    setCart((prev) => prev.filter((item) => item.produtoId !== produtoId));
  };

  const subtotalTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const totalFinal = Math.max(0, subtotalTotal - discount);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const venda = addVenda({
      clienteNome,
      vendedorNome: caixa.operador || 'Atendente',
      itens: cart,
      total: totalFinal,
      desconto: discount,
      formaPagamento,
      status: 'Concluída',
      lojaId: caixa.lojaId || 'store-1'
    });

    setCompletedVenda(venda);
    setCart([]);
    setDiscount(0);
    setClienteNome('Consumidor Final');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Product Selector (Catalog) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            {/* Search input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou código de barras..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Categories bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 shrink-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'todas' ? 'Todas Categorias' : cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.estoqueAtual <= 0;

              return (
                <button
                  key={prod.id}
                  disabled={isOutOfStock}
                  onClick={() => addToCart(prod)}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                      : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        {prod.codigo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          prod.estoqueAtual <= prod.estoqueMinimo
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Estoque: {prod.estoqueAtual}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-sky-600">
                      {prod.nome}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-black text-slate-900">
                      R$ {prod.precoVenda.toFixed(2)}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Cart Summary & Checkout */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-sky-500" />
              <span>Carrinho de Venda</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {cart.length} item(s)
            </span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Package className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
                <p className="text-xs font-medium">Seu carrinho está vazio.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Clique nos produtos ao lado para adicionar.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.produtoId} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 block leading-tight">
                      {item.nome}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      R$ {item.precoUnitario.toFixed(2)} cada
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCartQty(item.produtoId, -1)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-slate-800 w-6 text-center">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.produtoId, 1)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">
                      R$ {item.subtotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.produtoId)}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Controls */}
          <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50/50 p-4 rounded-xl">
            {/* Customer Select */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>Cliente</span>
              </label>
              <select
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
              >
                <option value="Consumidor Final">Consumidor Final</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome} ({c.cpfCnpj})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Pix', label: 'Pix', icon: QrCode },
                  { id: 'Cartão de Crédito', label: 'Crédito', icon: CreditCard },
                  { id: 'Cartão de Débito', label: 'Débito', icon: CreditCard },
                  { id: 'Dinheiro', label: 'Dinheiro', icon: Banknote },
                  { id: 'Fiado', label: 'Fiado', icon: User }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = formaPagamento === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormaPagamento(pm.id as any)}
                      className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discount & Total Calculation */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-semibold">R$ {subtotalTotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>Desconto (R$):</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 text-right px-2 py-0.5 border border-slate-200 rounded-md text-xs font-semibold bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-lg text-emerald-600 font-black">
                  R$ {totalFinal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finalizar Venda (R$ {totalFinal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Completed Sale Receipt Modal */}
      {completedVenda && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Venda Realizada com Sucesso!
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {completedVenda.codigoVenda}
              </p>
            </div>

            <div className="py-4 space-y-2 font-mono text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span className="font-bold">{completedVenda.clienteNome}</span>
              </div>
              <div className="flex justify-between">
                <span>Pagamento:</span>
                <span className="font-bold">{completedVenda.formaPagamento}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 space-y-1">
                {completedVenda.itens.map((it) => (
                  <div key={it.produtoId} className="flex justify-between">
                    <span>
                      {it.quantidade}x {it.nome}
                    </span>
                    <span>R$ {it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>TOTAL:</span>
                <span className="text-emerald-600">
                  R$ {completedVenda.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setCompletedVenda(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
