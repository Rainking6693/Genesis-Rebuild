import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanError } from './SubscriptionPlan'; // Assuming you have a SubscriptionPlan component or model

interface Props {
  initialSubscriptionPlan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
  onSubscriptionError?: (error: SubscriptionPlanError) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange, onSubscriptionError }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(initialSubscriptionPlan);

  useEffect(() => {
    onSubscriptionChange(subscriptionPlan);
  }, [subscriptionPlan, onSubscriptionChange]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    setSubscriptionPlan(newPlan);
  };

  const handleSubscriptionError = (error: SubscriptionPlanError) => {
    if (onSubscriptionError) {
      onSubscriptionError(error);
    }
  };

  return (
    <div>
      <h2 id="subscription-management">Subscription Management</h2>
      <SubscriptionPlan
        plan={subscriptionPlan}
        onChange={handleSubscriptionChange}
        onError={handleSubscriptionError}
        aria-labelledby="subscription-management" // Adding aria-labelledby for accessibility
      />
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanError } from './SubscriptionPlan'; // Assuming you have a SubscriptionPlan component or model

interface Props {
  initialSubscriptionPlan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
  onSubscriptionError?: (error: SubscriptionPlanError) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange, onSubscriptionError }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(initialSubscriptionPlan);

  useEffect(() => {
    onSubscriptionChange(subscriptionPlan);
  }, [subscriptionPlan, onSubscriptionChange]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    setSubscriptionPlan(newPlan);
  };

  const handleSubscriptionError = (error: SubscriptionPlanError) => {
    if (onSubscriptionError) {
      onSubscriptionError(error);
    }
  };

  return (
    <div>
      <h2 id="subscription-management">Subscription Management</h2>
      <SubscriptionPlan
        plan={subscriptionPlan}
        onChange={handleSubscriptionChange}
        onError={handleSubscriptionError}
        aria-labelledby="subscription-management" // Adding aria-labelledby for accessibility
      />
    </div>
  );
};

export default SubscriptionManagement;