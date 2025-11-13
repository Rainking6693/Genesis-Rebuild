import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  userId: string;
  subscriptionId: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
  createdAt: Date;
  expiresAt: Date;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found in localStorage');
        return;
      }

      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error fetching subscriptions: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      if (isMountedRef.current) {
        setSubscriptions(data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError('An unexpected error occurred while fetching subscriptions');
        console.error('Error fetching subscriptions:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchSubscriptions();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Error cancelling subscription: ${errorData.message}`);
          return;
        }

        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.subscriptionId === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
      } catch (error) {
        setError('An unexpected error occurred while cancelling the subscription');
        console.error('Error cancelling subscription:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [setSubscriptions]
  );

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <table aria-label="Subscription Management" className="subscription-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.title}</td>
                <td>{subscription.description}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.status}</td>
                <td>{subscription.createdAt.toLocaleString()}</td>
                <td>{subscription.expiresAt.toLocaleString()}</td>
                <td>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                      disabled={isLoading}
                      className="cancel-button"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  userId: string;
  subscriptionId: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
  createdAt: Date;
  expiresAt: Date;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found in localStorage');
        return;
      }

      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error fetching subscriptions: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      if (isMountedRef.current) {
        setSubscriptions(data);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError('An unexpected error occurred while fetching subscriptions');
        console.error('Error fetching subscriptions:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchSubscriptions();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Error cancelling subscription: ${errorData.message}`);
          return;
        }

        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.subscriptionId === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
      } catch (error) {
        setError('An unexpected error occurred while cancelling the subscription');
        console.error('Error cancelling subscription:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [setSubscriptions]
  );

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <table aria-label="Subscription Management" className="subscription-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.title}</td>
                <td>{subscription.description}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.status}</td>
                <td>{subscription.createdAt.toLocaleString()}</td>
                <td>{subscription.expiresAt.toLocaleString()}</td>
                <td>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                      disabled={isLoading}
                      className="cancel-button"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubscriptionManagement;