import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { SubscriptionPlan, SubscriptionPlanType } from './SubscriptionPlan'; // Assuming SubscriptionPlan is a separate component or type definition

type Props = {
  initialSubscriptionPlan: SubscriptionPlanType;
  onSubscriptionChange: Dispatch<SetStateAction<SubscriptionPlanType>>;
};

const SubscriptionManagement: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange }) => {
  const [subscriptionPlan, setSubscriptionPlan] = onSubscriptionChange || useState<SubscriptionPlanType>(initialSubscriptionPlan);

  const handleSubscriptionChange = (newPlan: SubscriptionPlanType) => {
    setSubscriptionPlan(newPlan);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubscriptionChange(subscriptionPlan);
    }
  };

  useEffect(() => {
    // If onSubscriptionChange prop is not a function, set it as the state updater
    if (typeof onSubscriptionChange !== 'function') {
      onSubscriptionChange = setSubscriptionPlan;
    }
  }, [onSubscriptionChange]);

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <h2>Subscription Management</h2>
      <SubscriptionPlan plan={subscriptionPlan} onChange={handleSubscriptionChange} />
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { SubscriptionPlan, SubscriptionPlanType } from './SubscriptionPlan'; // Assuming SubscriptionPlan is a separate component or type definition

type Props = {
  initialSubscriptionPlan: SubscriptionPlanType;
  onSubscriptionChange: Dispatch<SetStateAction<SubscriptionPlanType>>;
};

const SubscriptionManagement: React.FC<Props> = ({ initialSubscriptionPlan, onSubscriptionChange }) => {
  const [subscriptionPlan, setSubscriptionPlan] = onSubscriptionChange || useState<SubscriptionPlanType>(initialSubscriptionPlan);

  const handleSubscriptionChange = (newPlan: SubscriptionPlanType) => {
    setSubscriptionPlan(newPlan);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubscriptionChange(subscriptionPlan);
    }
  };

  useEffect(() => {
    // If onSubscriptionChange prop is not a function, set it as the state updater
    if (typeof onSubscriptionChange !== 'function') {
      onSubscriptionChange = setSubscriptionPlan;
    }
  }, [onSubscriptionChange]);

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <h2>Subscription Management</h2>
      <SubscriptionPlan plan={subscriptionPlan} onChange={handleSubscriptionChange} />
    </div>
  );
};

export default SubscriptionManagement;