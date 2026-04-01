import { Calculator, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LockedButton from '../components/LockedButton';
import { usePlan } from '../context/PlanContext';
import { costPredictorData, events } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

const invoiceRows = [
  { id: 'INV-221', client: 'Nimali & Dhanuka', amount: 420000, status: 'Due in 2 days' },
  { id: 'INV-222', client: 'Serendib Mobility', amount: 680000, status: 'Partially Paid' },
  { id: 'INV-223', client: 'Laksetha Foundation', amount: 210000, status: 'Pending Approval' },
  { id: 'INV-224', client: 'Nawaloka Holdings', amount: 750000, status: 'Due Today' },
];

function FinancesPage() {
  const { canAccess } = usePlan();
  const [rows, setRows] = useState(
    events.map((event) => ({
      id: event.id,
      eventName: event.name,
      income: event.budget,
      expense: event.spent,
    })),
  );
  const [autoCalcResult, setAutoCalcResult] = useState(null);

  const totals = useMemo(() => {
    const income = rows.reduce((sum, row) => sum + Number(row.income || 0), 0);
    const expense = rows.reduce((sum, row) => sum + Number(row.expense || 0), 0);
    const grossProfit = income - expense;

    return {
      income,
      expense,
      grossProfit,
    };
  }, [rows]);

  const runAutoCalculation = () => {
    const margin = totals.income > 0 ? (totals.grossProfit / totals.income) * 100 : 0;
    const estimatedTax = totals.grossProfit > 0 ? totals.grossProfit * 0.12 : 0;

    setAutoCalcResult({
      margin,
      estimatedTax,
      netProfit: totals.grossProfit - estimatedTax,
    });

    toast.success('Margins, tax estimate, and net profit calculated automatically.');
  };

  const runAiPredictor = () => {
    toast.success('AI predictor flagged two high-risk cost spikes and suggested adjustments.');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Finances & Budgeting</h3>
            <p className="text-sm text-slate-500">Start with manual entries and reveal automation by upgrading plans.</p>
          </div>

          <LockedButton
            requiredPlan="intermediate"
            icon="🔒"
            feature="Auto-Calculate Margins & Tax"
            benefit="Automatically calculate gross margin, tax, and net profitability for every event portfolio."
            onClick={runAutoCalculation}
          >
            Auto-Calculate Margins & Tax
          </LockedButton>
        </div>

        <div className="mt-4 overflow-x-auto soft-scrollbar">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Event</th>
                <th className="px-3 py-3 text-right">Income</th>
                <th className="px-3 py-3 text-right">Expense</th>
                <th className="px-3 py-3 text-right">Manual Gross</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold text-slate-800">{row.eventName}</td>
                  <td className="px-3 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      value={row.income}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  income: event.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      className="w-28 rounded-lg border border-slate-300 px-2 py-1.5 text-right font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      value={row.expense}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  expense: event.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                      className="w-28 rounded-lg border border-slate-300 px-2 py-1.5 text-right font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-700">
                    {formatCurrency(Number(row.income || 0) - Number(row.expense || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Income</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{formatCurrency(totals.income)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Expense</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{formatCurrency(totals.expense)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Gross Profit</p>
            <p className="mt-1 text-xl font-extrabold text-emerald-700">{formatCurrency(totals.grossProfit)}</p>
          </div>
        </div>

        {autoCalcResult ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">Automated Financial Snapshot</p>
            <div className="mt-2 grid gap-2 text-sm text-emerald-700 sm:grid-cols-3">
              <p>Margin: {autoCalcResult.margin.toFixed(1)}%</p>
              <p>Estimated Tax: {formatCurrency(autoCalcResult.estimatedTax)}</p>
              <p>Net Profit: {formatCurrency(autoCalcResult.netProfit)}</p>
            </div>
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="mb-3 flex items-center gap-2">
            <FileSpreadsheet size={17} className="text-indigo-600" />
            <h4 className="text-base font-extrabold text-slate-900">Digital Invoice Tracking</h4>
          </div>

          {canAccess('intermediate') ? (
            <div className="overflow-x-auto soft-scrollbar">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-2 py-2">Invoice</th>
                    <th className="px-2 py-2">Client</th>
                    <th className="px-2 py-2 text-right">Amount</th>
                    <th className="px-2 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceRows.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-2 py-2 font-semibold text-slate-700">{invoice.id}</td>
                      <td className="px-2 py-2 text-slate-600">{invoice.client}</td>
                      <td className="px-2 py-2 text-right font-semibold text-slate-700">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-2 py-2 text-right text-xs font-semibold text-blue-700">{invoice.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                🔒 Intermediate unlocks digital invoice lifecycle tracking and reminders.
              </p>
              <LockedButton
                requiredPlan="intermediate"
                icon="🔒"
                feature="Digital Invoice Tracking"
                benefit="Track every invoice in real time with due-date alerts and payment status visibility."
                className="mt-3"
              >
                Unlock Invoice Tracking
              </LockedButton>
            </div>
          )}
        </article>

        {canAccess('intermediate') ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-indigo-600" />
                <h4 className="text-base font-extrabold text-slate-900">AI Cost Overrun Predictor</h4>
              </div>
              {canAccess('advanced') ? (
                <button
                  type="button"
                  onClick={runAiPredictor}
                  className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  Run Prediction
                </button>
              ) : null}
            </div>

            {canAccess('advanced') ? (
              <>
                <div className="h-64 rounded-2xl bg-slate-50 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costPredictorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="week" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#2563eb"
                        strokeWidth={2.3}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#10b981"
                        strokeWidth={2.3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  AI suggests reserving an 8% contingency buffer for lighting + logistics in the final week.
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  👑 Advanced unlocks predictive overrun detection and mitigation recommendations.
                </p>
                <LockedButton
                  requiredPlan="advanced"
                  icon="👑"
                  feature="AI Cost Overrun Predictor"
                  benefit="Forecast budget risks before event day and receive recommended cost controls automatically."
                  className="mt-3"
                >
                  Unlock AI Predictor
                </LockedButton>
              </div>
            )}
          </article>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="flex items-center gap-2 text-slate-700">
          <Calculator size={16} className="text-indigo-600" />
          <p className="text-sm">
            Demo flow tip: show manual edits first, then click locked actions to trigger upsell modal and switch plans live.
          </p>
        </div>
      </section>
    </div>
  );
}

export default FinancesPage;
