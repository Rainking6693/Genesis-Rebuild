import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  userId: string;
  subscriptionId: string;
  title: string;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = userIdRef.current || localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in localStorage or component state');
      }
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSubscriptions(data);
      userIdRef.current = userId;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to fetch subscriptions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = userIdRef.current || localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in localStorage or component state');
        }
        const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.subscriptionId === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        setError('Failed to cancel subscription. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [setSubscriptions, setError, setIsLoading]
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
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.title}</td>
                <td>{subscription.description}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.startDate.toLocaleDateString()}</td>
                <td>{subscription.endDate.toLocaleDateString()}</td>
                <td>{subscription.status}</td>
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
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = userIdRef.current || localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in localStorage or component state');
      }
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSubscriptions(data);
      userIdRef.current = userId;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Failed to fetch subscriptions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = userIdRef.current || localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in localStorage or component state');
        }
        const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.subscriptionId === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        setError('Failed to cancel subscription. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [setSubscriptions, setError, setIsLoading]
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
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.title}</td>
                <td>{subscription.description}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.startDate.toLocaleDateString()}</td>
                <td>{subscription.endDate.toLocaleDateString()}</td>
                <td>{subscription.status}</td>
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