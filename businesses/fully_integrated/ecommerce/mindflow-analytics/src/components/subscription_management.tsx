import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Subscription {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
}

interface SubscriptionManagementProps {
  title?: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ title = 'Subscription Management' }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response = await axios.get<Subscription[]>('/api/subscriptions', {
        signal: abortControllerRef.current.signal,
      });
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(`Error fetching subscriptions: ${axiosError.message}`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscriptions]);

  const handleSubscriptionCancel = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        await axios.post(`/api/subscriptions/${subscriptionId}/cancel`);
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(`Error cancelling subscription: ${axiosError.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [setSubscriptions, setError, setIsLoading]
  );

  return (
    <div>
      <h1>{title}</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table aria-label="Subscription Management">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td>{subscription.title}</td>
                <td>{subscription.description}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.status}</td>
                <td>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleSubscriptionCancel(subscription.id)}
                      disabled={isLoading}
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

interface Subscription {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
}

interface SubscriptionManagementProps {
  title?: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ title = 'Subscription Management' }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response = await axios.get<Subscription[]>('/api/subscriptions', {
        signal: abortControllerRef.current.signal,
      });
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(`Error fetching subscriptions: ${axiosError.message}`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscriptions]);

  const handleSubscriptionCancel = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        await axios.post(`/api/subscriptions/${subscriptionId}/cancel`);
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(`Error cancelling subscription: ${axiosError.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [setSubscriptions, setError, setIsLoading]
  );

  return (
    <div>
      <h1>{title}</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table aria-label="Subscription Management">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td>{subscription.title}</td>
                <td>{subscription.description}</td>
                <td>${subscription.price.toFixed(2)}</td>
                <td>{subscription.status}</td>
                <td>
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleSubscriptionCancel(subscription.id)}
                      disabled={isLoading}
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