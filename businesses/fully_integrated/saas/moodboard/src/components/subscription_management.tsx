import React, { useState, useEffect, useMemo } from 'react';
import { SubscriptionPlan } from './subscription-plans';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  user: string;
  initialIsActive?: boolean; // Add default value for initial subscription status
  onSubscriptionChange: (user: string, isActive: boolean) => void;
}

const MyComponent: React.FC<Props> = ({ subscriptionPlan, user, initialIsActive = false, onSubscriptionChange }) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [loading, setLoading] = useState(!!subscriptionPlan);

  useEffect(() => {
    if (subscriptionPlan) {
      setLoading(false);
      setIsActive(subscriptionPlan.isActive);
      onSubscriptionChange(user, isActive);
    }
  }, [subscriptionPlan, user, onSubscriptionChange]);

  const handleSubscriptionChange = () => {
    setIsActive(!isActive);
  };

  const subscriptionPlanName = useMemo(() => {
    if (subscriptionPlan) {
      return subscriptionPlan.name;
    }
    return 'Loading...';
  }, [subscriptionPlan]);

  const disabled = isLoading || (isActive && !subscriptionPlan);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <h3>{subscriptionPlanName}</h3>
          <p>{subscriptionPlan?.description || 'Loading...'}</p>
          <p>Subscription Status: {isActive ? 'Active' : 'Inactive'}</p>
          <button onClick={handleSubscriptionChange} disabled={disabled}>
            {isActive ? 'Cancel Subscription' : 'Subscribe'}
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useMemo } from 'react';
import { SubscriptionPlan } from './subscription-plans';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  user: string;
  initialIsActive?: boolean; // Add default value for initial subscription status
  onSubscriptionChange: (user: string, isActive: boolean) => void;
}

const MyComponent: React.FC<Props> = ({ subscriptionPlan, user, initialIsActive = false, onSubscriptionChange }) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [loading, setLoading] = useState(!!subscriptionPlan);

  useEffect(() => {
    if (subscriptionPlan) {
      setLoading(false);
      setIsActive(subscriptionPlan.isActive);
      onSubscriptionChange(user, isActive);
    }
  }, [subscriptionPlan, user, onSubscriptionChange]);

  const handleSubscriptionChange = () => {
    setIsActive(!isActive);
  };

  const subscriptionPlanName = useMemo(() => {
    if (subscriptionPlan) {
      return subscriptionPlan.name;
    }
    return 'Loading...';
  }, [subscriptionPlan]);

  const disabled = isLoading || (isActive && !subscriptionPlan);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <h3>{subscriptionPlanName}</h3>
          <p>{subscriptionPlan?.description || 'Loading...'}</p>
          <p>Subscription Status: {isActive ? 'Active' : 'Inactive'}</p>
          <button onClick={handleSubscriptionChange} disabled={disabled}>
            {isActive ? 'Cancel Subscription' : 'Subscribe'}
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;