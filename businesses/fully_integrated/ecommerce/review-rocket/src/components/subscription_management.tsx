import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  userId: string;
  subscriptionId: string;
  title: string;
  content: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<SubscriptionProps[]> = await axios.get('/api/subscriptions');
      if (isMounted.current) {
        setSubscriptions(response.data);
        setError(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (isMounted.current) {
        setError(`Error fetching subscriptions: ${axiosError.message}`);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        await axios.post('/api/subscriptions/cancel', { subscriptionId });
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.subscriptionId === subscriptionId ? { ...sub, status: 'cancelled' } : sub
          )
        );
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(`Error cancelling subscription: ${axiosError.message}`);
      }
    },
    []
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
        <table aria-label="Subscription Management">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.title}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.status}</td>
                <td>{new Date(subscription.createdAt).toLocaleString()}</td>
                <td>{new Date(subscription.updatedAt).toLocaleString()}</td>
                <td>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                      aria-label={`Cancel subscription for ${subscription.title}`}
                    >
                      Cancel
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
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  userId: string;
  subscriptionId: string;
  title: string;
  content: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<SubscriptionProps[]> = await axios.get('/api/subscriptions');
      if (isMounted.current) {
        setSubscriptions(response.data);
        setError(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (isMounted.current) {
        setError(`Error fetching subscriptions: ${axiosError.message}`);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        await axios.post('/api/subscriptions/cancel', { subscriptionId });
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.subscriptionId === subscriptionId ? { ...sub, status: 'cancelled' } : sub
          )
        );
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(`Error cancelling subscription: ${axiosError.message}`);
      }
    },
    []
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
        <table aria-label="Subscription Management">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.title}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.status}</td>
                <td>{new Date(subscription.createdAt).toLocaleString()}</td>
                <td>{new Date(subscription.updatedAt).toLocaleString()}</td>
                <td>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                      aria-label={`Cancel subscription for ${subscription.title}`}
                    >
                      Cancel
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