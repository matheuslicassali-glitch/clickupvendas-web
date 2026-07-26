import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, TrendingUp, DollarSign, Package } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const RelatoriosView: React.FC = () => {
  const { vendas, produtos, showToast } = useApp();

  const totalFaturamento = vendas.reduce((acc, v) => acc + v.total, 0);

  // Group sales by payment method
  const salesByPayment: Record<string, number> = {};
  vendas.forEach((v) => {
    salesByPayment[v.formaPagamento] = (salesByPayment[v.formaPagamento] || 0) + v.total;
  });

  const pieData = Object.keys(salesByPayment).map((pm) => ({
    name: pm,
    value: salesByPayment[pm]
  }));

  const COLORS = ['#38a9e4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const exportCSV = () => {
    const headers = ['Codigo Venda', 'Data', 'Cliente', 'Forma Pagamento', 'Total (R$)'];
    const rows = vendas.map((v) => [
      v.codigoVenda,
      new Date(v.data).toLocaleDateString('pt-BR'),
      v.clienteNome,
      v.formaPagamento,
      v.total.toFixed(2)
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_vendas_clickup_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Relatório em CSV exportado com sucesso!');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-500" />
            <span>Relatórios & Inteligência de Negócio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analise formas de pagamento, margem e exporte planilhas gerenciais.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Vendas por Forma de Pagamento
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Participação de Pix, Cartão e Dinheiro no faturamento
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2">
            {pieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-600 font-medium">{entry.name}:</span>
                <span className="font-bold text-slate-900">
                  R$ {entry.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            Produtos Mais Lucrativos no Estoque
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Itens com maior margem de contribuição bruta
          </p>

          <div className="space-y-3">
            {produtos.slice(0, 5).map((p) => {
              const margem = ((p.precoVenda - p.precoCusto) / p.precoCusto) * 100;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">
                      {p.nome}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Custo: R$ {p.precoCusto.toFixed(2)} | Venda: R$ {p.precoVenda.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600 text-xs">
                    +{margem.toFixed(0)}% Lucro
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
