import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionPlan, SubscriptionPlanStatus } from './subscription-plans'; // Assuming you have a subscription-plans module

interface Props {
  initialSubscriptionPlan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(initialSubscriptionPlan);
  const subscriptionPlanRef = useRef<SubscriptionPlan>(initialSubscriptionPlan);

  useEffect(() => {
    subscriptionPlanRef.current = initialSubscriptionPlan;
    setSubscriptionPlan(initialSubscriptionPlan);
  }, [initialSubscriptionPlan]);

  useEffect(() => {
    if (subscriptionPlanRef.current !== subscriptionPlan) {
      // If the subscription plan has changed outside of the component, revert to the initial plan
      setSubscriptionPlan(subscriptionPlanRef.current);
    }
  }, [subscriptionPlan]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    if (newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      setSubscriptionPlan(newPlan);
      onSubscriptionChange(newPlan);
    }
  };

  const handleInitialPlanChange = (newPlan: SubscriptionPlan) => {
    if (newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      subscriptionPlanRef.current = newPlan;
      setSubscriptionPlan(newPlan);
    }
  };

  return (
    <div>
      <h2>Subscription Management</h2>
      {/* Render subscription plan details and options for changing plans */}
      <SubscriptionPlan
        plan={subscriptionPlan}
        onPlanChange={handleSubscriptionChange}
        disabled={subscriptionPlan.status !== SubscriptionPlanStatus.AVAILABLE}
      />
      {/* Add an option to revert to the initial plan */}
      <button onClick={() => handleInitialPlanChange(subscriptionPlanRef.current)}>
        Revert to Initial Plan
      </button>
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionPlan, SubscriptionPlanStatus } from './subscription-plans'; // Assuming you have a subscription-plans module

interface Props {
  initialSubscriptionPlan: SubscriptionPlan;
  onSubscriptionChange: (plan: SubscriptionPlan) => void;
}

const SubscriptionManagement: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(initialSubscriptionPlan);
  const subscriptionPlanRef = useRef<SubscriptionPlan>(initialSubscriptionPlan);

  useEffect(() => {
    subscriptionPlanRef.current = initialSubscriptionPlan;
    setSubscriptionPlan(initialSubscriptionPlan);
  }, [initialSubscriptionPlan]);

  useEffect(() => {
    if (subscriptionPlanRef.current !== subscriptionPlan) {
      // If the subscription plan has changed outside of the component, revert to the initial plan
      setSubscriptionPlan(subscriptionPlanRef.current);
    }
  }, [subscriptionPlan]);

  const handleSubscriptionChange = (newPlan: SubscriptionPlan) => {
    if (newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      setSubscriptionPlan(newPlan);
      onSubscriptionChange(newPlan);
    }
  };

  const handleInitialPlanChange = (newPlan: SubscriptionPlan) => {
    if (newPlan.status === SubscriptionPlanStatus.AVAILABLE) {
      subscriptionPlanRef.current = newPlan;
      setSubscriptionPlan(newPlan);
    }
  };

  return (
    <div>
      <h2>Subscription Management</h2>
      {/* Render subscription plan details and options for changing plans */}
      <SubscriptionPlan
        plan={subscriptionPlan}
        onPlanChange={handleSubscriptionChange}
        disabled={subscriptionPlan.status !== SubscriptionPlanStatus.AVAILABLE}
      />
      {/* Add an option to revert to the initial plan */}
      <button onClick={() => handleInitialPlanChange(subscriptionPlanRef.current)}>
        Revert to Initial Plan
      </button>
    </div>
  );
};

export default SubscriptionManagement;