import {
  Building2,
  CalendarRange,
  LayoutDashboard,
  Sparkles,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import PlanBadge from './PlanBadge';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: CalendarRange },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/vendors', label: 'Vendors', icon: Building2 },
  { to: '/finances', label: 'Finances', icon: Wallet },
];

const nextTierByPlan = {
  basic: 'Intermediate',
  intermediate: 'Advanced',
  advanced: 'Everything Unlocked',
};

function Sidebar({ isOpen, onClose }) {
  const { plan, openPricingModal } = usePlan();

  const openUpgradeModal = () => {
    openPricingModal({
      feature: 'Upgrade Plan',
      requiredPlan: 'intermediate',
      benefit: 'Choose a higher tier to unlock automation and premium client workflows across every page.',
      icon: '✨',
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/55 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[84vw] max-w-72 flex-col border-r border-slate-200 bg-white/90 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 sm:p-5 lg:w-72 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Axon Events</p>
            <h1 className="mt-2 text-xl font-extrabold text-slate-900">Demo</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 space-y-1.5 sm:mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <PlanBadge plan={plan} />
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                <Zap size={12} /> Live Demo
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Next value reveal: <span className="font-semibold text-slate-800">{nextTierByPlan[plan]}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={openUpgradeModal}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 text-sm font-extrabold text-indigo-700 shadow-[0_10px_24px_-18px_rgba(79,70,229,0.75)] transition hover:-translate-y-0.5 hover:from-indigo-100 hover:to-blue-100"
          >
            <Sparkles size={16} />
            ✨ Upgrade Plan
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
