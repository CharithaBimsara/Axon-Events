import { Menu, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import PlanBadge from './PlanBadge';

const pageLabels = {
  '/dashboard': 'Business Overview',
  '/events': 'Events Management',
  '/team': 'Team & Staff Management',
  '/clients': 'Client Directory',
  '/vendors': 'Vendor & Supplier Management',
  '/finances': 'Finances & Budgeting',
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const lockedFeaturesByPlan = {
  basic: 10,
  intermediate: 4,
  advanced: 0,
};

function Header({ onOpenSidebar }) {
  const location = useLocation();
  const { plan, switchPlan, planOptions } = usePlan();
  const title = pageLabels[location.pathname] ?? 'Axon Events';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">{title}</h2>
            <p className="text-xs text-slate-500 sm:text-sm">{dateFormatter.format(new Date())}</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 sm:block">
            <p className="font-semibold">
              {lockedFeaturesByPlan[plan] === 0
                ? 'All premium features unlocked'
                : `${lockedFeaturesByPlan[plan]} premium moments to reveal`}
            </p>
          </div>

          <PlanBadge plan={plan} className="hidden sm:inline-flex" />

          <div className="relative">
            <Sparkles
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
            />
            <select
              value={plan}
              onChange={(event) => switchPlan(event.target.value)}
              className="appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-10 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              aria-label="Switch package plan"
            >
              {planOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
