import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanName } from './subscription-plans';

type Props = {
  plan?: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
};

const SubscriptionPlanNameToButton: Record<SubscriptionPlanName, React.FC<{ onClick: () => void }>> = {
  [SubscriptionPlanName.Basic]: BasicButton,
  [SubscriptionPlanName.Pro]: ProButton,
  [SubscriptionPlanName.Premium]: PremiumButton,
};

const SubscriptionPlanButton: React.FC<{ plan: SubscriptionPlan; onClick: () => void }> = ({ plan, onClick }) => (
  <button type="button" onClick={onClick} aria-label={`Change to ${plan.name}`}>
    {plan.name}
  </button>
);

const BasicButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <SubscriptionPlanButton plan={SubscriptionPlan.Basic} onClick={onClick} />
);

const ProButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <SubscriptionPlanButton plan={SubscriptionPlan.Pro} onClick={onClick} />
);

const PremiumButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <SubscriptionPlanButton plan={SubscriptionPlan.Premium} onClick={onClick} />
);

const SubscriptionManagement: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SubscriptionPlan.Basic);
  const [isLoading, setIsLoading] = useState<boolean>(!!plan);

  useEffect(() => {
    if (plan) {
      setSelectedPlan(plan);
      setIsLoading(false);
    }
  }, [plan]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    setSelectedPlan(newPlan);
    onSubscriptionChange(newPlan);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Display current subscription plan details */}
      <SubscriptionPlan plan={selectedPlan} />

      {/* Provide options to change subscription plan */}
      {Object.entries(SubscriptionPlanNameToButton).map(([planName, ButtonComponent]) => (
        <ButtonComponent key={planName} onClick={() => handleSubscriptionChange(SubscriptionPlan[planName as SubscriptionPlanName])} />
      ))}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanName } from './subscription-plans';

type Props = {
  plan?: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
};

const SubscriptionPlanNameToButton: Record<SubscriptionPlanName, React.FC<{ onClick: () => void }>> = {
  [SubscriptionPlanName.Basic]: BasicButton,
  [SubscriptionPlanName.Pro]: ProButton,
  [SubscriptionPlanName.Premium]: PremiumButton,
};

const SubscriptionPlanButton: React.FC<{ plan: SubscriptionPlan; onClick: () => void }> = ({ plan, onClick }) => (
  <button type="button" onClick={onClick} aria-label={`Change to ${plan.name}`}>
    {plan.name}
  </button>
);

const BasicButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <SubscriptionPlanButton plan={SubscriptionPlan.Basic} onClick={onClick} />
);

const ProButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <SubscriptionPlanButton plan={SubscriptionPlan.Pro} onClick={onClick} />
);

const PremiumButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <SubscriptionPlanButton plan={SubscriptionPlan.Premium} onClick={onClick} />
);

const SubscriptionManagement: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SubscriptionPlan.Basic);
  const [isLoading, setIsLoading] = useState<boolean>(!!plan);

  useEffect(() => {
    if (plan) {
      setSelectedPlan(plan);
      setIsLoading(false);
    }
  }, [plan]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    setSelectedPlan(newPlan);
    onSubscriptionChange(newPlan);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Display current subscription plan details */}
      <SubscriptionPlan plan={selectedPlan} />

      {/* Provide options to change subscription plan */}
      {Object.entries(SubscriptionPlanNameToButton).map(([planName, ButtonComponent]) => (
        <ButtonComponent key={planName} onClick={() => handleSubscriptionChange(SubscriptionPlan[planName as SubscriptionPlanName])} />
      ))}
    </div>
  );
};

export default SubscriptionManagement;