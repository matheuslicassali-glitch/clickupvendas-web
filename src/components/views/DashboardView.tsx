import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Users,
  Receipt,
  Wallet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { vendas, produtos, caixas, funcionarios, clientes, periodo } = useApp();

  const totalFaturamento = vendas.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalVendas = vendas.length;
  const ticketMedio = totalVendas > 0 ? totalFaturamento / totalVendas : 0;
  const produtosAlerta = produtos.filter(p => p.estoque_atual <= p.estoque_minimo);
  const caixaAberto = caixas.find(c => c.status === 'Aberto');
  const clientesAtivos = clientes.filter(c => c.status === 'Ativo').length;

  const vendasPorDia = vendas.reduce((acc: Record<string, number>, v) => {
    const d = new Date(v.data).toLocaleDateString('pt-BR');
    acc[d] = (acc[d] || 0) + (v.total || 0);
    return acc;
  }, {});

  const chartData = Object.entries(vendasPorDia).map(([dia, faturamento]) => ({
    dia: dia.split('/').slice(0, 2).join('/'),
    faturamento
  }));

  const vendasPorForma = vendas.reduce((acc: Record<string, number>, v) => {
    acc[v.forma_pagamento] = (acc[v.forma_pagamento] || 0) + (v.total || 0);
    return acc;
  }, {});

  const periodoLabel = periodo === 'hoje' ? 'Hoje' : periodo === 'semana' ? 'Esta Semana' : 'Este Mês';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faturamento {periodoLabel}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">R$ {totalFaturamento.toFixed(2)}</h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{totalVendas} vendas realizadas</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">R$ {ticketMedio.toFixed(2)}</h3>
            <p className="text-xs text-sky-600 font-medium mt-1">por venda</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Caixa Aberto</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {caixaAberto ? `R$ ${(caixaAberto.saldo_inicial || 0).toFixed(2)}` : 'Fechado'}
            </h3>
            <p className="text-xs text-purple-600 font-medium mt-1">
              {caixaAberto ? `Operador: ${caixaAberto.operador}` : 'Nenhum caixa aberto'}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alerta Estoque</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{produtosAlerta.length} itens</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">abaixo do mínimo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-800">Faturamento por Dia</h3>
            <p className="text-xs text-slate-500">{periodoLabel}</p>
          </div>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38a9e4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38a9e4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dia" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Faturamento']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="faturamento" stroke="#38a9e4" strokeWidth={3} fillOpacity={1} fill="url(#colorFat)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sem dados para exibir</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-800 mb-4">Formas de Pagamento</h3>
          <div className="space-y-3">
            {Object.entries(vendasPorForma).map(([forma, valor]) => (
              <div key={forma} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">{forma}</span>
                <span className="text-sm font-bold text-slate-800">R$ {(valor as number).toFixed(2)}</span>
              </div>
            ))}
            {Object.keys(vendasPorForma).length === 0 && (
              <p className="text-slate-400 text-xs text-center py-4">Sem dados</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Funcionários Ativos</span>
              <span className="font-bold text-slate-800">{funcionarios.filter(f => f.status === 'Ativo').length}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-slate-500">Clientes Cadastrados</span>
              <span className="font-bold text-slate-800">{clientesAtivos}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Últimas Vendas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendas.slice(0, 5).map(v => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{v.codigo}</td>
                  <td className="py-3 px-4 text-slate-700">{v.cliente_nome}</td>
                  <td className="py-3 px-4 text-slate-500">{v.vendedor_nome}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700">{v.forma_pagamento}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">R$ {(v.total || 0).toFixed(2)}</td>
                </tr>
              ))}
              {vendas.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Sem vendas no período</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
