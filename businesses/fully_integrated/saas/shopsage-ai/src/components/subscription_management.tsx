import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanStatus } from './subscription-plans'; // Assuming you have a subscription-plans module

interface Props {
  plan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      onSubscriptionChange(currentPlan);
    } else {
      setError(`Current plan is not available.`);
    }
  }, [currentPlan, onSubscriptionChange]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    if (newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      setCurrentPlan(newPlan);
      setError(null);
    } else {
      setError(`The selected plan is not available.`);
    }
  };

  const isCurrentPlanUpgradable = currentPlan.upgradePlan && currentPlan.upgradePlan.status === SubscriptionPlanStatus.AVAILABLE;
  const isCurrentPlanDowngradable = currentPlan.downgradePlan && currentPlan.downgradePlan.status === SubscriptionPlanStatus.AVAILABLE;

  return (
    <div>
      <h2>Subscription Management</h2>
      {/* Display current plan details */}
      <div>Current Plan: {currentPlan.name}</div>
      <div>Features: {currentPlan.features.join(', ')}</div>
      <div>Price: ${currentPlan.price}</div>

      {/* Offer upgrade and downgrade options */}
      <button disabled={!isCurrentPlanUpgradable} onClick={() => handleSubscriptionChange(currentPlan.upgradePlan)}>Upgrade</button>
      <button disabled={!isCurrentPlanDowngradable} onClick={() => handleSubscriptionChange(currentPlan.downgradePlan)}>Downgrade</button>

      {/* Display error message if no upgrade or downgrade plan is available */}
      {!isCurrentPlanUpgradable && <div>No upgrade plan available.</div>}
      {!isCurrentPlanDowngradable && <div>No downgrade plan available.</div>}

      {/* Display error message if the current plan is not available */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Add ARIA attributes for accessibility */}
      <button aria-disabled={!isCurrentPlanUpgradable} aria-label="Upgrade to the next plan">Upgrade</button>
      <button aria-disabled={!isCurrentPlanDowngradable} aria-label="Downgrade to the previous plan">Downgrade</button>
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanStatus } from './subscription-plans'; // Assuming you have a subscription-plans module

interface Props {
  plan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      onSubscriptionChange(currentPlan);
    } else {
      setError(`Current plan is not available.`);
    }
  }, [currentPlan, onSubscriptionChange]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    if (newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      setCurrentPlan(newPlan);
      setError(null);
    } else {
      setError(`The selected plan is not available.`);
    }
  };

  const isCurrentPlanUpgradable = currentPlan.upgradePlan && currentPlan.upgradePlan.status === SubscriptionPlanStatus.AVAILABLE;
  const isCurrentPlanDowngradable = currentPlan.downgradePlan && currentPlan.downgradePlan.status === SubscriptionPlanStatus.AVAILABLE;

  return (
    <div>
      <h2>Subscription Management</h2>
      {/* Display current plan details */}
      <div>Current Plan: {currentPlan.name}</div>
      <div>Features: {currentPlan.features.join(', ')}</div>
      <div>Price: ${currentPlan.price}</div>

      {/* Offer upgrade and downgrade options */}
      <button disabled={!isCurrentPlanUpgradable} onClick={() => handleSubscriptionChange(currentPlan.upgradePlan)}>Upgrade</button>
      <button disabled={!isCurrentPlanDowngradable} onClick={() => handleSubscriptionChange(currentPlan.downgradePlan)}>Downgrade</button>

      {/* Display error message if no upgrade or downgrade plan is available */}
      {!isCurrentPlanUpgradable && <div>No upgrade plan available.</div>}
      {!isCurrentPlanDowngradable && <div>No downgrade plan available.</div>}

      {/* Display error message if the current plan is not available */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Add ARIA attributes for accessibility */}
      <button aria-disabled={!isCurrentPlanUpgradable} aria-label="Upgrade to the next plan">Upgrade</button>
      <button aria-disabled={!isCurrentPlanDowngradable} aria-label="Downgrade to the previous plan">Downgrade</button>
    </div>
  );
};

export default SubscriptionManagement;