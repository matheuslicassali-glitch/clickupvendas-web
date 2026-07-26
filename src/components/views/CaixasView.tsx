import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MinusCircle,
  Lock,
  Unlock,
  User,
  Clock
} from 'lucide-react';

export const CaixasView: React.FC = () => {
  const { caixa, addMovimentacaoCaixa, fecharCaixa, abrirCaixa } = useApp();

  const [isSangriaOpen, setIsSangriaOpen] = useState(false);
  const [isSuprimentoOpen, setIsSuprimentoOpen] = useState(false);
  const [valorMov, setValorMov] = useState(0);
  const [descricaoMov, setDescricaoMov] = useState('');

  const [valorFechamentoReal, setValorFechamentoReal] = useState(0);
  const [isFecharOpen, setIsFecharOpen] = useState(false);

  const [novoSaldoInicial, setNovoSaldoInicial] = useState(250);
  const [novoOperador, setNovoOperador] = useState('Beatriz Santos');

  const handleSangria = (e: React.FormEvent) => {
    e.preventDefault();
    addMovimentacaoCaixa({
      tipo: 'Sangria',
      descricao: descricaoMov || 'Retirada de Sangria',
      valor: Number(valorMov),
      operador: caixa.operador
    });
    setIsSangriaOpen(false);
    setValorMov(0);
    setDescricaoMov('');
  };

  const handleSuprimento = (e: React.FormEvent) => {
    e.preventDefault();
    addMovimentacaoCaixa({
      tipo: 'Suprimento',
      descricao: descricaoMov || 'Aporte de Suprimento',
      valor: Number(valorMov),
      operador: caixa.operador
    });
    setIsSuprimentoOpen(false);
    setValorMov(0);
    setDescricaoMov('');
  };

  const handleConfirmFechar = (e: React.FormEvent) => {
    e.preventDefault();
    fecharCaixa(Number(valorFechamentoReal));
    setIsFecharOpen(false);
  };

  const handleAbrir = (e: React.FormEvent) => {
    e.preventDefault();
    abrirCaixa(Number(novoSaldoInicial), novoOperador);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Caixa Status Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              caixa.status === 'Aberto'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-rose-100 text-rose-600'
            }`}
          >
            {caixa.status === 'Aberto' ? (
              <Unlock className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                Caixa PDV #{caixa.id.slice(-6)}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  caixa.status === 'Aberto'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {caixa.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Operador: <b>{caixa.operador}</b>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Abertura: {new Date(caixa.dataAbertura).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        {caixa.status === 'Aberto' ? (
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setIsSuprimentoOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Suprimento (Entrada)</span>
            </button>

            <button
              onClick={() => setIsSangriaOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <MinusCircle className="w-4 h-4" />
              <span>Sangria (Retirada)</span>
            </button>

            <button
              onClick={() => setIsFecharOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Fechar Caixa</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAbrir} className="flex items-center gap-2">
            <input
              type="number"
              value={novoSaldoInicial}
              onChange={(e) => setNovoSaldoInicial(Number(e.target.value))}
              placeholder="Fundo de Troco"
              className="px-3 py-2 border rounded-xl text-xs font-bold w-32"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Abrir Novo Caixa
            </button>
          </form>
        )}
      </div>

      {/* Caixa Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Fundo de Troco Inicial
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            R$ {caixa.saldoInicial.toFixed(2)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Saldo Atual Estimado
          </span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">
            R$ {caixa.saldoFinalEstimado.toFixed(2)}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Total de Lançamentos
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {caixa.movimentacoes.length} registros
          </h3>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">
            Histórico de Movimentações do Caixa Atual
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Horário</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4">Operador</th>
                <th className="py-3.5 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {caixa.movimentacoes.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {new Date(mov.data).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        mov.tipo === 'Venda' || mov.tipo === 'Suprimento'
                          ? 'bg-emerald-50 text-emerald-700'
                          : mov.tipo === 'Sangria'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {mov.tipo}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {mov.descricao}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{mov.operador}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold ${
                      mov.tipo === 'Sangria' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {mov.tipo === 'Sangria' ? '-' : '+'} R$ {mov.valor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals for Sangria, Suprimento, Fechamento */}
      {(isSangriaOpen || isSuprimentoOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              {isSangriaOpen ? 'Realizar Sangria (Retirada)' : 'Aporte de Suprimento (Entrada)'}
            </h3>
            <form onSubmit={isSangriaOpen ? handleSangria : handleSuprimento} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={valorMov}
                  onChange={(e) => setValorMov(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motivo / Observação
                </label>
                <input
                  type="text"
                  required
                  value={descricaoMov}
                  onChange={(e) => setDescricaoMov(e.target.value)}
                  placeholder="Ex: Retirada de segurança"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSangriaOpen(false);
                    setIsSuprimentoOpen(false);
                  }}
                  className="px-3 py-2 border rounded-lg text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white font-bold rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFecharOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              Conferência e Fechamento do Caixa
            </h3>
            <p className="text-slate-500 mb-4">
              Saldo estimado em gaveta: <b>R$ {caixa.saldoFinalEstimado.toFixed(2)}</b>
            </p>
            <form onSubmit={handleConfirmFechar} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor Contado na Gaveta (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={valorFechamentoReal}
                  onChange={(e) => setValorFechamentoReal(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold text-sm text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFecharOpen(false)}
                  className="px-3 py-2 border rounded-lg text-slate-600"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg"
                >
                  Encerrar Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
