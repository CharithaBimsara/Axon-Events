import { motion } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { usePlan } from '../context/PlanContext';

const basicFeatures = [
  'Centralized Event Dashboard',
  'Manual Task Checklist',
  'Client & Vendor Directory',
  'Basic Budget Tracking',
];

const intermediateFeatures = [
  'Everything in Basic, plus:',
  'Auto-Assign Staff Tasks',
  'Automated Event Timeline',
  'SMS & Email Alert Workflows',
  'Automated Profit Tracking',
];

const advancedFeatures = [
  'Everything in Intermediate, plus:',
  'Interactive Client Portal',
  'Vendor Login Workspace',
  'AI Business Analytics',
  'Online Payment Gateway',
];

function FeatureList({ features, tone = 'slate' }) {
  const iconTone =
    tone === 'primary'
      ? 'bg-indigo-100 text-indigo-600'
      : 'bg-slate-100 text-slate-500';

  return (
    <ul className="mt-4 mb-5 space-y-2.5 text-sm text-slate-600">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${iconTone}`}>
            <Check size={12} />
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function UpgradePricingModal() {
  const { plan, switchPlan, pricingModalState, closePricingModal } = usePlan();
  const isOpen = Boolean(pricingModalState);
  const currentPlanLabel = `${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;

  const handleUpgrade = (targetPlan) => {
    switchPlan(targetPlan);
    closePricingModal();
    toast.success('Successfully upgraded! New features unlocked.');
  };

  if (typeof document === 'undefined') {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const getActionLabel = (targetPlan) => {
    if (plan === targetPlan) {
      return 'Current Plan';
    }

    if (targetPlan === 'intermediate') {
      return 'Upgrade to Intermediate';
    }

    if (targetPlan === 'advanced') {
      return 'Upgrade to Advanced';
    }

    return 'Switch to Basic';
  };

  const getButtonClass = (targetPlan) => {
    if (plan === targetPlan) {
      return 'mt-auto w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500';
    }

    if (targetPlan === 'intermediate') {
      return 'mt-auto w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700';
    }

    if (targetPlan === 'advanced') {
      return 'mt-auto w-full rounded-xl border border-indigo-300 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50';
    }

    return 'mt-auto w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50';
  };

  const handlePlanAction = (targetPlan) => {
    if (plan === targetPlan) {
      return;
    }

    handleUpgrade(targetPlan);
  };

  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 z-[100] h-screen w-screen bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={closePricingModal}
      />

      <motion.div
        className="fixed inset-0 z-[101] h-screen w-screen p-4"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        onClick={closePricingModal}
      >
        <section className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePricingModal}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close pricing modal"
            >
              <X size={18} />
            </button>

            <header className="mb-6 pr-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles size={13} />
                Plan Upgrade
              </div>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                Upgrade your plan to unlock more automation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Compare what each package unlocks and switch instantly to continue your live demo.
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Current plan: {currentPlanLabel}
              </p>
              {pricingModalState?.feature ? (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Triggered from {pricingModalState.icon} {pricingModalState.feature}
                </p>
              ) : null}
            </header>

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">Basic Plan</p>
                <FeatureList features={basicFeatures} />

                <button
                  type="button"
                  onClick={() => handlePlanAction('basic')}
                  disabled={plan === 'basic'}
                  className={getButtonClass('basic')}
                >
                  {getActionLabel('basic')}
                </button>
              </article>

              <article className="relative flex h-full flex-col rounded-2xl border-2 border-indigo-500 bg-white p-5 shadow-[0_22px_45px_-26px_rgba(79,70,229,0.65)]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Recommended
                </span>
                <p className="text-sm font-semibold text-indigo-600">Intermediate Plan</p>
                <FeatureList features={intermediateFeatures} tone="primary" />

                <button
                  type="button"
                  onClick={() => handlePlanAction('intermediate')}
                  disabled={plan === 'intermediate'}
                  className={getButtonClass('intermediate')}
                >
                  {getActionLabel('intermediate')}
                </button>
              </article>

              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-500">Advanced Plan</p>
                <FeatureList features={advancedFeatures} />

                <button
                  type="button"
                  onClick={() => handlePlanAction('advanced')}
                  disabled={plan === 'advanced'}
                  className={getButtonClass('advanced')}
                >
                  {getActionLabel('advanced')}
                </button>
              </article>
            </div>
          </div>
        </section>
      </motion.div>
    </>,
    document.body,
  );
}

export default UpgradePricingModal;
