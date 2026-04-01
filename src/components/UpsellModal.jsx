import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { usePlan } from '../context/PlanContext';
import PlanBadge from './PlanBadge';

function UpsellModal() {
  const { plan, switchPlan, upsellState, closeUpsell } = usePlan();

  const handleUpgrade = () => {
    if (!upsellState) {
      return;
    }

    switchPlan(upsellState.requiredPlan);
    toast.success(`Switched to ${upsellState.requiredPlan} plan for demo walkthrough.`);
    closeUpsell();
  };

  if (typeof document === 'undefined' || !upsellState) {
    return null;
  }

  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 z-[100] h-screen w-screen bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={closeUpsell}
      />

      <motion.div
        className="fixed inset-0 z-[101] h-screen w-screen p-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={closeUpsell}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative w-[92vw] max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeUpsell}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close upsell modal"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Feature Upgrade</p>
                <h3 className="text-xl font-extrabold text-slate-900">{upsellState.icon} {upsellState.feature}</h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">{upsellState.benefit}</p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Recommended move</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PlanBadge plan={plan} />
                <ArrowUpRight size={15} className="text-slate-400" />
                <PlanBadge plan={upsellState.requiredPlan} />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Switching plans updates every page instantly so your client can see the exact premium value story.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeUpsell}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                onClick={handleUpgrade}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Switch to {upsellState.requiredPlan}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}

export default UpsellModal;
