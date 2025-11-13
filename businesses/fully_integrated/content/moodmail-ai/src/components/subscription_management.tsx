import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'paused';
  renewalDate: Date;
}

interface User {
  id: string;
  email: string;
  subscriptions: Subscription[];
}

interface SubscriptionManagementProps {
  user: User;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/subscriptions`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (isMounted.current) {
        setSubscriptions(data);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching subscriptions:', err);
        setError('Failed to fetch subscriptions. Please try again later.');
      }
    }
  }, [user.id]);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const handleSubscriptionAction = useCallback(
    async (subscriptionId: string, action: 'cancel' | 'pause' | 'resume') => {
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}/${action}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? { ...subscription, status: action === 'cancel' ? 'cancelled' : action === 'pause' ? 'paused' : 'active' }
              : subscription
          )
        );
        setError(null);
      } catch (err) {
        console.error(`Error ${action}ling subscription:`, err);
        setError(`Failed to ${action} subscription. Please try again later.`);
      }
    },
    []
  );

  return (
    <div>
      <h1>Subscription Management</h1>
      <h2>Your Subscriptions</h2>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {subscriptions.length === 0 ? (
        <p>You don't have any active subscriptions.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <h3>{subscription.plan}</h3>
              <p>Status: {subscription.status}</p>
              <p>Renewal Date: {subscription.renewalDate.toLocaleDateString()}</p>
              {subscription.status === 'active' && (
                <button onClick={() => handleSubscriptionAction(subscription.id, 'pause')}>Pause</button>
              )}
              {subscription.status === 'paused' && (
                <button onClick={() => handleSubscriptionAction(subscription.id, 'resume')}>Resume</button>
              )}
              {subscription.status === 'active' && (
                <button onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}>Cancel</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'paused';
  renewalDate: Date;
}

interface User {
  id: string;
  email: string;
  subscriptions: Subscription[];
}

interface SubscriptionManagementProps {
  user: User;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/subscriptions`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (isMounted.current) {
        setSubscriptions(data);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching subscriptions:', err);
        setError('Failed to fetch subscriptions. Please try again later.');
      }
    }
  }, [user.id]);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const handleSubscriptionAction = useCallback(
    async (subscriptionId: string, action: 'cancel' | 'pause' | 'resume') => {
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}/${action}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? { ...subscription, status: action === 'cancel' ? 'cancelled' : action === 'pause' ? 'paused' : 'active' }
              : subscription
          )
        );
        setError(null);
      } catch (err) {
        console.error(`Error ${action}ling subscription:`, err);
        setError(`Failed to ${action} subscription. Please try again later.`);
      }
    },
    []
  );

  return (
    <div>
      <h1>Subscription Management</h1>
      <h2>Your Subscriptions</h2>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {subscriptions.length === 0 ? (
        <p>You don't have any active subscriptions.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <h3>{subscription.plan}</h3>
              <p>Status: {subscription.status}</p>
              <p>Renewal Date: {subscription.renewalDate.toLocaleDateString()}</p>
              {subscription.status === 'active' && (
                <button onClick={() => handleSubscriptionAction(subscription.id, 'pause')}>Pause</button>
              )}
              {subscription.status === 'paused' && (
                <button onClick={() => handleSubscriptionAction(subscription.id, 'resume')}>Resume</button>
              )}
              {subscription.status === 'active' && (
                <button onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}>Cancel</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionManagement;