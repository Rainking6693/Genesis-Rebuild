import React, { useState } from 'react';
import { SubscriptionPlan, SubscriptionPlanStatus } from './subscription-plans';

interface Props {
  plan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [currentPlan, setCurrentPlan] = useState(plan);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan | null) => {
    if (newPlan && newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      if (newPlan.id !== currentPlan.id) {
        if (
          (newPlan.status === SubscriptionPlanStatus.UPGRADE && newPlan.price <= currentPlan.price) ||
          (newPlan.status === SubscriptionPlanStatus.DOWNGRADE && newPlan.price >= currentPlan.price) ||
          (newPlan.status === SubscriptionPlanStatus.UPGRADE && !currentPlan.upgradePlan || newPlan.features.every((feature) => !currentPlan.features.includes(feature))) ||
          (newPlan.status === SubscriptionPlanStatus.DOWNGRADE && !currentPlan.downgradePlan || currentPlan.features.every((feature) => newPlan.features.includes(feature))) ||
          (newPlan.status === SubscriptionPlanStatus.UPGRADE && !currentPlan.upgradePlan || !currentPlan.upgradePlan.status || currentPlan.upgradePlan.status !== SubscriptionPlanStatus.AVAILABLE) ||
          (newPlan.status === SubscriptionPlanStatus.DOWNGRADE && !currentPlan.downgradePlan || !currentPlan.downgradePlan.status || currentPlan.downgradePlan.status !== SubscriptionPlanStatus.AVAILABLE)
        ) {
          onSubscriptionChange(newPlan);
          setCurrentPlan(newPlan);
        }
      }
    }
  };

  const isCurrentPlanUpgradable =
    currentPlan.upgradePlan && currentPlan.upgradePlan.status === SubscriptionPlanStatus.AVAILABLE;
  const isCurrentPlanDowngradable =
    currentPlan.downgradePlan && currentPlan.downgradePlan.status === SubscriptionPlanStatus.AVAILABLE;

  return (
    <div>
      {/* Display current subscription plan details */}
      <div>Current Plan: {currentPlan.name}</div>
      <div>Features: {currentPlan.features.join(', ')}</div>
      <div>Price: ${currentPlan.price}</div>

      {/* Offer upgrade and downgrade options */}
      {isCurrentPlanUpgradable && (
        <button onClick={() => handleSubscriptionChange(currentPlan.upgradePlan)} aria-label="Upgrade subscription plan">
          Upgrade
        </button>
      )}
      {isCurrentPlanDowngradable && (
        <button onClick={() => handleSubscriptionChange(currentPlan.downgradePlan)} aria-label="Downgrade subscription plan">
          Downgrade
        </button>
      )}

      {/* Display error message if no upgrade or downgrade options are available */}
      {!isCurrentPlanUpgradable && !isCurrentPlanDowngradable && <div>No upgrade or downgrade options available.</div>}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState } from 'react';
import { SubscriptionPlan, SubscriptionPlanStatus } from './subscription-plans';

interface Props {
  plan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [currentPlan, setCurrentPlan] = useState(plan);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan | null) => {
    if (newPlan && newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      if (newPlan.id !== currentPlan.id) {
        if (
          (newPlan.status === SubscriptionPlanStatus.UPGRADE && newPlan.price <= currentPlan.price) ||
          (newPlan.status === SubscriptionPlanStatus.DOWNGRADE && newPlan.price >= currentPlan.price) ||
          (newPlan.status === SubscriptionPlanStatus.UPGRADE && !currentPlan.upgradePlan || newPlan.features.every((feature) => !currentPlan.features.includes(feature))) ||
          (newPlan.status === SubscriptionPlanStatus.DOWNGRADE && !currentPlan.downgradePlan || currentPlan.features.every((feature) => newPlan.features.includes(feature))) ||
          (newPlan.status === SubscriptionPlanStatus.UPGRADE && !currentPlan.upgradePlan || !currentPlan.upgradePlan.status || currentPlan.upgradePlan.status !== SubscriptionPlanStatus.AVAILABLE) ||
          (newPlan.status === SubscriptionPlanStatus.DOWNGRADE && !currentPlan.downgradePlan || !currentPlan.downgradePlan.status || currentPlan.downgradePlan.status !== SubscriptionPlanStatus.AVAILABLE)
        ) {
          onSubscriptionChange(newPlan);
          setCurrentPlan(newPlan);
        }
      }
    }
  };

  const isCurrentPlanUpgradable =
    currentPlan.upgradePlan && currentPlan.upgradePlan.status === SubscriptionPlanStatus.AVAILABLE;
  const isCurrentPlanDowngradable =
    currentPlan.downgradePlan && currentPlan.downgradePlan.status === SubscriptionPlanStatus.AVAILABLE;

  return (
    <div>
      {/* Display current subscription plan details */}
      <div>Current Plan: {currentPlan.name}</div>
      <div>Features: {currentPlan.features.join(', ')}</div>
      <div>Price: ${currentPlan.price}</div>

      {/* Offer upgrade and downgrade options */}
      {isCurrentPlanUpgradable && (
        <button onClick={() => handleSubscriptionChange(currentPlan.upgradePlan)} aria-label="Upgrade subscription plan">
          Upgrade
        </button>
      )}
      {isCurrentPlanDowngradable && (
        <button onClick={() => handleSubscriptionChange(currentPlan.downgradePlan)} aria-label="Downgrade subscription plan">
          Downgrade
        </button>
      )}

      {/* Display error message if no upgrade or downgrade options are available */}
      {!isCurrentPlanUpgradable && !isCurrentPlanDowngradable && <div>No upgrade or downgrade options available.</div>}
    </div>
  );
};

export default SubscriptionManagement;