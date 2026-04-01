const stylesByPlan = {
  basic: 'bg-slate-200 text-slate-700 border-slate-300',
  intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
  advanced: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const labelByPlan = {
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function PlanBadge({ plan, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${stylesByPlan[plan]} ${className}`}
    >
      {labelByPlan[plan]} Plan
    </span>
  );
}

export default PlanBadge;
