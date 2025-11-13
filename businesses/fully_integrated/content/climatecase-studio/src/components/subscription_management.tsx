import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionData {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<SubscriptionData[]> = await axios.get<
        SubscriptionData[]
      >('/api/subscriptions', { signal });
      setSubscriptions(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Fetch subscriptions request cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'Error fetching subscriptions'
        );
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

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await axios.post(`/api/subscriptions/${subscriptionId}/cancel`);
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'Error cancelling subscription'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div>
      <h2>Subscription Management</h2>
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading" aria-live="assertive">
          Loading...
        </div>
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
                      onClick={() => handleCancelSubscription(subscription.id)}
                      disabled={isLoading}
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

interface SubscriptionData {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'cancelled' | 'pending';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<SubscriptionData[]> = await axios.get<
        SubscriptionData[]
      >('/api/subscriptions', { signal });
      setSubscriptions(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Fetch subscriptions request cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'Error fetching subscriptions'
        );
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

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await axios.post(`/api/subscriptions/${subscriptionId}/cancel`);
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === subscriptionId
              ? { ...subscription, status: 'cancelled' }
              : subscription
          )
        );
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'Error cancelling subscription'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <div>
      <h2>Subscription Management</h2>
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading" aria-live="assertive">
          Loading...
        </div>
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
                      onClick={() => handleCancelSubscription(subscription.id)}
                      disabled={isLoading}
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