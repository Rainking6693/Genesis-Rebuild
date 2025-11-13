import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanWithoutSelfReference } from './subscription-plans';

interface Props {
  plan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const MyComponent: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanWithoutSelfReference | null>(plan);

  useEffect(() => {
    if (selectedPlan) {
      onSubscriptionChange(selectedPlan as SubscriptionPlan);
    }
  }, [selectedPlan, onSubscriptionChange]);

  const handlePlanSelection = (newPlan: SubscriptionPlanWithoutSelfReference | null) => {
    setSelectedPlan(newPlan);
  };

  const isUpgradeButtonEnabled = () => {
    return selectedPlan && selectedPlan.upgradePlan !== plan;
  };

  const isDowngradeButtonEnabled = () => {
    return selectedPlan && selectedPlan.downgradePlan !== plan;
  };

  const handleSubscriptionChange = () => {
    if (selectedPlan) {
      onSubscriptionChange(selectedPlan);
    }
  };

  return (
    <div>
      {/* Display plan details */}
      <h2>{plan.name}</h2>
      <p>{plan.description}</p>
      <p>Monthly cost: ${plan.cost}</p>

      {/* Add buttons for upgrading or downgrading */}
      <button disabled={!isUpgradeButtonEnabled()} onClick={() => handlePlanSelection(plan.upgradePlan)}>
        Upgrade to {plan.upgradePlan?.name || 'Unknown'}
      </button>
      <button disabled={!isDowngradeButtonEnabled()} onClick={() => handlePlanSelection(plan.downgradePlan)}>
        Downgrade to {plan.downgradePlan?.name || 'Unknown'}
      </button>

      {/* Add a button to confirm the selected plan change */}
      <button disabled={!selectedPlan} onClick={handleSubscriptionChange}>
        Confirm {selectedPlan?.name || 'Current'} Plan
      </button>

      {/* Add accessibility labels for buttons */}
      <label htmlFor="upgrade-button">Upgrade to {plan.upgradePlan?.name || 'Unknown'}</label>
      <button id="upgrade-button" disabled={!isUpgradeButtonEnabled()} onClick={() => handlePlanSelection(plan.upgradePlan)}>
        Upgrade
      </button>

      <label htmlFor="downgrade-button">Downgrade to {plan.downgradePlan?.name || 'Unknown'}</label>
      <button id="downgrade-button" disabled={!isDowngradeButtonEnabled()} onClick={() => handlePlanSelection(plan.downgradePlan)}>
        Downgrade
      </button>

      <label htmlFor="confirm-button">Confirm {selectedPlan?.name || 'Current'} Plan</label>
      <button id="confirm-button" disabled={!selectedPlan} onClick={handleSubscriptionChange}>
        Confirm
      </button>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanWithoutSelfReference } from './subscription-plans';

interface Props {
  plan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const MyComponent: React.FC<Props> = ({ plan, onSubscriptionChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanWithoutSelfReference | null>(plan);

  useEffect(() => {
    if (selectedPlan) {
      onSubscriptionChange(selectedPlan as SubscriptionPlan);
    }
  }, [selectedPlan, onSubscriptionChange]);

  const handlePlanSelection = (newPlan: SubscriptionPlanWithoutSelfReference | null) => {
    setSelectedPlan(newPlan);
  };

  const isUpgradeButtonEnabled = () => {
    return selectedPlan && selectedPlan.upgradePlan !== plan;
  };

  const isDowngradeButtonEnabled = () => {
    return selectedPlan && selectedPlan.downgradePlan !== plan;
  };

  const handleSubscriptionChange = () => {
    if (selectedPlan) {
      onSubscriptionChange(selectedPlan);
    }
  };

  return (
    <div>
      {/* Display plan details */}
      <h2>{plan.name}</h2>
      <p>{plan.description}</p>
      <p>Monthly cost: ${plan.cost}</p>

      {/* Add buttons for upgrading or downgrading */}
      <button disabled={!isUpgradeButtonEnabled()} onClick={() => handlePlanSelection(plan.upgradePlan)}>
        Upgrade to {plan.upgradePlan?.name || 'Unknown'}
      </button>
      <button disabled={!isDowngradeButtonEnabled()} onClick={() => handlePlanSelection(plan.downgradePlan)}>
        Downgrade to {plan.downgradePlan?.name || 'Unknown'}
      </button>

      {/* Add a button to confirm the selected plan change */}
      <button disabled={!selectedPlan} onClick={handleSubscriptionChange}>
        Confirm {selectedPlan?.name || 'Current'} Plan
      </button>

      {/* Add accessibility labels for buttons */}
      <label htmlFor="upgrade-button">Upgrade to {plan.upgradePlan?.name || 'Unknown'}</label>
      <button id="upgrade-button" disabled={!isUpgradeButtonEnabled()} onClick={() => handlePlanSelection(plan.upgradePlan)}>
        Upgrade
      </button>

      <label htmlFor="downgrade-button">Downgrade to {plan.downgradePlan?.name || 'Unknown'}</label>
      <button id="downgrade-button" disabled={!isDowngradeButtonEnabled()} onClick={() => handlePlanSelection(plan.downgradePlan)}>
        Downgrade
      </button>

      <label htmlFor="confirm-button">Confirm {selectedPlan?.name || 'Current'} Plan</label>
      <button id="confirm-button" disabled={!selectedPlan} onClick={handleSubscriptionChange}>
        Confirm
      </button>
    </div>
  );
};

export default MyComponent;