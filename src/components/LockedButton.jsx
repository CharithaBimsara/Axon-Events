import { usePlan } from '../context/PlanContext';

function LockedButton({
  requiredPlan,
  feature,
  benefit,
  icon = '🔒',
  onClick,
  modalVariant = 'upsell',
  children,
  className = '',
}) {
  const { canAccess, openUpsell, openPricingModal } = usePlan();
  const unlocked = canAccess(requiredPlan);

  const handleClick = () => {
    if (unlocked) {
      onClick?.();
      return;
    }

    if (modalVariant === 'pricing') {
      openPricingModal({
        feature,
        requiredPlan,
        benefit,
        icon,
      });
      return;
    }

    openUpsell({
      feature,
      requiredPlan,
      benefit,
      icon,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        unlocked
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:bg-indigo-700'
          : 'cursor-pointer bg-slate-200 text-slate-600 grayscale hover:bg-slate-300'
      } ${className}`}
      aria-disabled={!unlocked}
    >
      {!unlocked ? <span>{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

export default LockedButton;
