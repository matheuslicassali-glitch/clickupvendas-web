import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, DollarSign, ShoppingCart, Receipt, Users, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const RelatoriosView: React.FC = () => {
  const { vendas, caixas, movimentacoes, financeiro, produtos, funcionarios, periodo, setPeriodo } = useApp();

  const totalVendas = vendas.reduce((a, v) => a + (v.total || 0), 0);
  const totalReceitas = financeiro.filter(f => f.tipo === 'Receita').reduce((a, f) => a + (f.valor || 0), 0);
  const totalDespesas = financeiro.filter(f => f.tipo === 'Despesa').reduce((a, f) => a + (f.valor || 0), 0);
  const vendasPorVendedor = vendas.reduce((acc: Record<string, number>, v) => {
    acc[v.vendedor_nome] = (acc[v.vendedor_nome] || 0) + (v.total || 0);
    return acc;
  }, {});

  const vendedorData = Object.entries(vendasPorVendedor).map(([nome, total]) => ({ nome, total }));

  const vendasPorForma = vendas.reduce((acc: Record<string, number>, v) => {
    acc[v.forma_pagamento] = (acc[v.forma_pagamento] || 0) + (v.total || 0);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-500" />
            <span>Relatórios & Gráficos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Análise consolidada de desempenho</p>
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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Vendas</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><ShoppingCart className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-slate-800">R$ {totalVendas.toFixed(2)}</h3><p className="text-xs text-slate-500 mt-1">{vendas.length} vendas</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Receitas</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-emerald-600">R$ {totalReceitas.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Despesas</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-rose-600">R$ {totalDespesas.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Movimentações Caixa</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Receipt className="w-5 h-5" /></div>
          </div>
          <div className="mt-4"><h3 className="text-2xl font-bold text-slate-800">{movimentacoes.length}</h3></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-800 mb-4">Vendas por Vendedor</h3>
          <div className="h-64">
            {vendedorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendedorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="nome" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Vendas']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="total" fill="#38a9e4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sem dados</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-800 mb-4">Vendas por Forma de Pagamento</h3>
          <div className="space-y-3">
            {Object.entries(vendasPorForma).map(([forma, valor]) => (
              <div key={forma} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">{forma}</span>
                <span className="text-sm font-bold text-slate-800">R$ {(valor as number).toFixed(2)}</span>
              </div>
            ))}
            {Object.keys(vendasPorForma).length === 0 && <p className="text-slate-400 text-xs text-center py-4">Sem dados</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-800 mb-3">Resumo Estoque</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-slate-500">Total Produtos</span><span className="font-bold text-slate-800">{produtos.length}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Estoque Baixo</span><span className="font-bold text-amber-600">{produtos.filter(p => p.estoque_atual <= p.estoque_minimo).length}</span></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-800 mb-3">Funcionários</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-slate-500">Total</span><span className="font-bold text-slate-800">{funcionarios.length}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Ativos</span><span className="font-bold text-emerald-600">{funcionarios.filter(f => f.status === 'Ativo').length}</span></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-800 mb-3">Caixas</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-slate-500">Total Sessões</span><span className="font-bold text-slate-800">{caixas.length}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Abertos</span><span className="font-bold text-emerald-600">{caixas.filter(c => c.status === 'Aberto').length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
