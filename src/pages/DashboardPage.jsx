import { BarChart3, BrainCircuit, CalendarClock, TrendingUp, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LockedButton from '../components/LockedButton';
import { usePlan } from '../context/PlanContext';
import { aiInsightData, eventSummary, events, monthlyProfitData } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

function DashboardPage() {
  const { canAccess } = usePlan();
  const [range, setRange] = useState('6m');
  const [lastGenerated, setLastGenerated] = useState(null);

  const canUseProfitReport = canAccess('intermediate');
  const canSeeAiCard = canAccess('intermediate');
  const canUseAiInsights = canAccess('advanced');

  const reportData = useMemo(() => {
    if (range === '3m') {
      return monthlyProfitData.slice(-3);
    }

    return monthlyProfitData;
  }, [range]);

  const projectedProfit = useMemo(
    () => reportData.reduce((sum, row) => sum + row.profit, 0),
    [reportData],
  );

  const metricCards = [
    {
      label: 'Active Events',
      value: eventSummary.activeEvents,
      icon: CalendarClock,
      tone: 'from-blue-500/15 to-indigo-500/5 text-blue-700',
    },
    {
      label: 'Clients This Quarter',
      value: eventSummary.clientsThisQuarter,
      icon: TrendingUp,
      tone: 'from-cyan-500/15 to-blue-500/5 text-cyan-700',
    },
    {
      label: 'Average Satisfaction',
      value: `${eventSummary.avgSatisfaction}/5`,
      icon: BrainCircuit,
      tone: 'from-emerald-500/15 to-teal-500/5 text-emerald-700',
    },
    {
      label: 'Revenue This Month',
      value: formatCurrency(eventSummary.revenueThisMonth),
      icon: Wallet,
      tone: 'from-indigo-500/15 to-sky-500/5 text-indigo-700',
    },
  ];

  const upcomingEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const generateProfitReport = () => {
    setLastGenerated(new Date().toLocaleTimeString());
    toast.success('Profit report generated with live event and vendor costs.');
  };

  const runAiAnalysis = () => {
    toast.success('AI insights refreshed with profitability and satisfaction signals.');
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${card.tone} p-4 shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{card.label}</p>
                <div className="rounded-xl bg-white/80 p-2">
                  <Icon size={16} />
                </div>
              </div>
              <p className="mt-5 text-2xl font-extrabold text-slate-900">{card.value}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Upcoming Event Flow</h3>
              <p className="text-sm text-slate-500">Centralized visibility for all active and upcoming projects.</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto soft-scrollbar">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">Event</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Venue</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-800">{event.name}</p>
                      <p className="text-xs text-slate-500">{event.type}</p>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">{formatDate(event.date)}</td>
                    <td className="px-3 py-3 text-slate-600">{event.venue}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-700">
                      {formatCurrency(event.budget)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Demo Storyline</h3>
              <p className="text-sm text-slate-500">Use this script while presenting to the client.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Start in <strong>Basic</strong>: show central event dashboard and manual control.
            </p>
            <p className="rounded-xl border border-slate-200 bg-blue-50 p-3">
              Switch to <strong>Intermediate</strong>: unlock automation and financial reporting.
            </p>
            <p className="rounded-xl border border-slate-200 bg-emerald-50 p-3">
              Land on <strong>Advanced</strong>: reveal AI insights and premium experience.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel transition-all duration-200 hover:shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Auto-Generate Profit Report</h3>
              <p className="text-sm text-slate-500">Monthly trend with one-click summary export.</p>
            </div>

            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
            </select>
          </div>

          {canUseProfitReport ? (
            <>
              <div className="mt-4 h-64 rounded-2xl bg-slate-50 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData}>
                    <defs>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#4f46e5"
                      strokeWidth={2.2}
                      fill="url(#profitGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Projected profit</p>
                  <p className="text-xl font-extrabold text-slate-900">{formatCurrency(projectedProfit)}</p>
                </div>

                <button
                  type="button"
                  onClick={generateProfitReport}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Generate Report
                </button>
              </div>

              {lastGenerated ? (
                <p className="mt-3 text-xs font-medium text-emerald-600">Last generated at {lastGenerated}</p>
              ) : null}
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-sm text-slate-600">
                🔒 Upgrade to Intermediate to auto-calculate costs, margins, and monthly profit trends.
              </p>
              <LockedButton
                requiredPlan="intermediate"
                icon="🔒"
                feature="Auto-Generate Profit Report"
                benefit="Instantly generate monthly profitability reports with zero manual spreadsheet work."
                className="mt-4"
              >
                Unlock Profit Automation
              </LockedButton>
            </div>
          )}
        </article>

        {canSeeAiCard ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">AI Business Insights</h3>
                <p className="text-sm text-slate-500">Segment-level insight into margin and client delight.</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Premium Analytics
              </span>
            </div>

            {canUseAiInsights ? (
              <>
                <div className="mt-4 h-64 rounded-2xl bg-slate-50 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aiInsightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="segment" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="margin" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="satisfaction" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    AI recommends prioritizing <strong>Wedding</strong> and <strong>Private</strong> segments for a 9% margin lift.
                  </p>
                  <button
                    type="button"
                    onClick={runAiAnalysis}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Refresh AI Insight
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">
                  👑 Advanced unlocks predictive charts, trend intelligence, and portfolio-level recommendations.
                </p>
                <LockedButton
                  requiredPlan="advanced"
                  icon="👑"
                  feature="AI Business Insights"
                  benefit="Get visual profitability analytics, AI recommendations, and proactive growth opportunities."
                  className="mt-4"
                >
                  Unlock AI Insights
                </LockedButton>
              </div>
            )}
          </article>
        ) : null}
      </section>
    </div>
  );
}

export default DashboardPage;
