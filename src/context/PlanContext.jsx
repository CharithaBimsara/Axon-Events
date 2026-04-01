import { createContext, useContext, useMemo, useState } from 'react';

const PLAN_ORDER = {
  basic: 0,
  intermediate: 1,
  advanced: 2,
};

export const PLAN_OPTIONS = [
  {
    value: 'basic',
    label: 'Basic',
    highlight: 'Manual workflows and digital organization',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    highlight: 'Automation for tasks, messaging, and finance',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    highlight: 'AI insights and premium client experience',
  },
];

const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState('basic');
  const [upsellState, setUpsellState] = useState(null);
  const [pricingModalState, setPricingModalState] = useState(null);
  const [animationSeed, setAnimationSeed] = useState(0);

  const canAccess = (requiredPlan) => PLAN_ORDER[plan] >= PLAN_ORDER[requiredPlan];

  const switchPlan = (nextPlan) => {
    if (!(nextPlan in PLAN_ORDER)) {
      return;
    }

    setPlan(nextPlan);
    setAnimationSeed((prev) => prev + 1);
  };

  const openUpsell = ({ feature, requiredPlan, benefit, icon = '🔒' }) => {
    setPricingModalState(null);
    setUpsellState({
      feature,
      requiredPlan,
      benefit,
      icon,
    });
  };

  const closeUpsell = () => setUpsellState(null);

  const openPricingModal = ({
    feature = 'Upgrade Plan',
    requiredPlan = 'intermediate',
    benefit = 'Compare plans to unlock deeper automation and premium client experiences.',
    icon = '✨',
  } = {}) => {
    setUpsellState(null);
    setPricingModalState({
      feature,
      requiredPlan,
      benefit,
      icon,
    });
  };

  const closePricingModal = () => setPricingModalState(null);

  const value = useMemo(
    () => ({
      plan,
      switchPlan,
      canAccess,
      upsellState,
      pricingModalState,
      openUpsell,
      closeUpsell,
      openPricingModal,
      closePricingModal,
      animationSeed,
      planOptions: PLAN_OPTIONS,
    }),
    [plan, upsellState, pricingModalState, animationSeed],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error('usePlan must be used within PlanProvider.');
  }

  return context;
}
