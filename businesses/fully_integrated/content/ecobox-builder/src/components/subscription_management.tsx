import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionStatus } from './SubscriptionPlan'; // Assuming you have a SubscriptionPlan component or model

interface Props {
  subscriptionPlan: SubscriptionPlan;
  onUpdateSubscription: (plan: SubscriptionPlan) => Promise<void>;
  onCancelSubscription: () => Promise<void>;
}

const SubscriptionManagement: React.FC<Props> = ({ subscriptionPlan, onUpdateSubscription, onCancelSubscription }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('active');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (subscriptionPlan.status !== subscriptionStatus) {
      setSubscriptionStatus(subscriptionPlan.status);
    }
  }, [subscriptionPlan]);

  const handleUpdateSubscription = () => {
    if (!isUpdating) {
      setIsUpdating(true);
      onUpdateSubscription(subscriptionPlan)
        .then(() => {
          setIsUpdating(false);
          setSubscriptionStatus('active');
        })
        .catch((error) => {
          setError(error);
          setIsUpdating(false);
        });
    }
  };

  const handleCancelSubscription = () => {
    if (!isCancelling) {
      setIsCancelling(true);
      onCancelSubscription()
        .then(() => {
          setIsCancelling(false);
          setSubscriptionStatus('cancelled');
        })
        .catch((error) => {
          setError(error);
          setIsCancelling(false);
        });
    }
  };

  const getButtonText = (isLoading: boolean, action: string) => {
    return isLoading ? `${action}...` : action;
  };

  return (
    <div>
      <h2>Subscription Management</h2>
      <h3>Current Plan: {subscriptionPlan.name}</h3>
      <p>Frequency: {subscriptionPlan.frequency}</p>
      <p>Price: {subscriptionPlan.price}</p>
      <p>Status: {subscriptionStatus}</p>
      {error && <p>Error: {error.message}</p>}
      <button disabled={isUpdating} onClick={handleUpdateSubscription}>
        {getButtonText(isUpdating, 'Update Subscription')}
      </button>
      <button disabled={isCancelling} onClick={handleCancelSubscription}>
        {getButtonText(isCancelling, 'Cancel Subscription')}
      </button>
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionStatus } from './SubscriptionPlan'; // Assuming you have a SubscriptionPlan component or model

interface Props {
  subscriptionPlan: SubscriptionPlan;
  onUpdateSubscription: (plan: SubscriptionPlan) => Promise<void>;
  onCancelSubscription: () => Promise<void>;
}

const SubscriptionManagement: React.FC<Props> = ({ subscriptionPlan, onUpdateSubscription, onCancelSubscription }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('active');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (subscriptionPlan.status !== subscriptionStatus) {
      setSubscriptionStatus(subscriptionPlan.status);
    }
  }, [subscriptionPlan]);

  const handleUpdateSubscription = () => {
    if (!isUpdating) {
      setIsUpdating(true);
      onUpdateSubscription(subscriptionPlan)
        .then(() => {
          setIsUpdating(false);
          setSubscriptionStatus('active');
        })
        .catch((error) => {
          setError(error);
          setIsUpdating(false);
        });
    }
  };

  const handleCancelSubscription = () => {
    if (!isCancelling) {
      setIsCancelling(true);
      onCancelSubscription()
        .then(() => {
          setIsCancelling(false);
          setSubscriptionStatus('cancelled');
        })
        .catch((error) => {
          setError(error);
          setIsCancelling(false);
        });
    }
  };

  const getButtonText = (isLoading: boolean, action: string) => {
    return isLoading ? `${action}...` : action;
  };

  return (
    <div>
      <h2>Subscription Management</h2>
      <h3>Current Plan: {subscriptionPlan.name}</h3>
      <p>Frequency: {subscriptionPlan.frequency}</p>
      <p>Price: {subscriptionPlan.price}</p>
      <p>Status: {subscriptionStatus}</p>
      {error && <p>Error: {error.message}</p>}
      <button disabled={isUpdating} onClick={handleUpdateSubscription}>
        {getButtonText(isUpdating, 'Update Subscription')}
      </button>
      <button disabled={isCancelling} onClick={handleCancelSubscription}>
        {getButtonText(isCancelling, 'Cancel Subscription')}
      </button>
    </div>
  );
};

export default SubscriptionManagement;