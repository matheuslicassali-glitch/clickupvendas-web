import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Plus,
  Users,
  Store
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { vendas, produtos, fornecedores, clientes, setActiveView } = useApp();

  const totalFaturamento = vendas.reduce((acc, v) => acc + v.total, 0);
  const totalVendasCount = vendas.length;
  const ticketMedio = totalVendasCount > 0 ? totalFaturamento / totalVendasCount : 0;
  const produtosAlertaEstoque = produtos.filter((p) => p.estoqueAtual <= p.estoqueMinimo);

  // Sample data for sales over time chart
  const salesChartData = [
    { dia: 'Seg', faturamento: 1240 },
    { dia: 'Ter', faturamento: 1890 },
    { dia: 'Qua', faturamento: 2390 },
    { dia: 'Qui', faturamento: 2000 },
    { dia: 'Sex', faturamento: 3490 },
    { dia: 'Sáb', faturamento: 4200 },
    { dia: 'Dom', faturamento: totalFaturamento }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faturamento Total
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              R$ {totalFaturamento.toFixed(2)}
            </h3>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% em relação a ontem</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total de Vendas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total de Vendas
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {totalVendasCount} pedidos
            </h3>
            <p className="text-xs text-sky-600 font-medium mt-1">
              Média de 8 vendas / hora
            </p>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              R$ {ticketMedio.toFixed(2)}
            </h3>
            <p className="text-xs text-purple-600 font-medium mt-1">
              Excelente desempenho por cliente
            </p>
          </div>
        </div>

        {/* Card 4: Alerta de Estoque */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alerta de Estoque
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              {produtosAlertaEstoque.length} itens baixos
            </h3>
            <button
              onClick={() => setActiveView('estoque')}
              className="text-xs text-amber-600 hover:underline font-medium mt-1 block cursor-pointer"
            >
              Verificar reposição &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Evolução do Faturamento
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhamento diário das vendas realizadas no PDV
              </p>
            </div>
            <button
              onClick={() => setActiveView('vendas')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Nova Venda
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38a9e4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38a9e4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dia" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Faturamento']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="faturamento"
                  stroke="#38a9e4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFaturamento)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Low Stock Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Atalhos do Gestor
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Acesso rápido para operações frequentes
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => setActiveView('vendas')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold">Realizar Nova Venda</span>
                </div>
                <Plus className="w-4 h-4 text-sky-600" />
              </button>

              <button
                onClick={() => setActiveView('fornecedores')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold">Cadastrar Fornecedor</span>
                </div>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveView('estoque')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold">Adicionar Produto</span>
                </div>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveView('clientes')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold">Novo Cliente</span>
                </div>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-1">
              Parceiros Ativos
            </span>
            <span className="text-sm font-bold text-slate-800">
              {fornecedores.filter((f) => f.status === 'Ativo').length} Fornecedores Homologados
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Últimas Vendas Realizadas
          </h3>
          <button
            onClick={() => setActiveView('vendas')}
            className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
          >
            Ver todas
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4">Operador</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendas.slice(0, 5).map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {v.codigoVenda}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {v.clienteNome}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700">
                      {v.formaPagamento}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {v.vendedorNome}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    R$ {v.total.toFixed(2)}
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
