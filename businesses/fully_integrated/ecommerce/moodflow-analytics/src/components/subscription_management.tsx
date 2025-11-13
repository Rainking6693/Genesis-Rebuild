import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<SubscriptionProps[]> = await axios.get<SubscriptionProps[]>('/api/subscriptions', { signal });
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

  const handleCancelSubscription = useCallback(
    async (userId: string, planId: string) => {
      try {
        await axios.post('/api/subscriptions/cancel', { userId, planId });
        fetchSubscriptions();
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(`Error cancelling subscription: ${axiosError.message}`);
      }
    },
    [fetchSubscriptions]
  );

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {isLoading ? (
        <div aria-live="polite">Loading...</div>
      ) : (
        <table aria-label="Subscription Management" role="grid">
          <thead>
            <tr role="row">
              <th role="columnheader">User ID</th>
              <th role="columnheader">Plan ID</th>
              <th role="columnheader">Start Date</th>
              <th role="columnheader">End Date</th>
              <th role="columnheader">Status</th>
              <th role="columnheader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription, index) => (
              <tr key={index} role="row">
                <td role="cell">{subscription.userId}</td>
                <td role="cell">{subscription.planId}</td>
                <td role="cell">{subscription.startDate.toLocaleDateString()}</td>
                <td role="cell">{subscription.endDate.toLocaleDateString()}</td>
                <td role="cell">{subscription.status}</td>
                <td role="cell">
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.userId, subscription.planId)}
                      aria-label={`Cancel subscription for user ${subscription.userId} and plan ${subscription.planId}`}
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
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<SubscriptionProps[]> = await axios.get<SubscriptionProps[]>('/api/subscriptions', { signal });
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

  const handleCancelSubscription = useCallback(
    async (userId: string, planId: string) => {
      try {
        await axios.post('/api/subscriptions/cancel', { userId, planId });
        fetchSubscriptions();
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(`Error cancelling subscription: ${axiosError.message}`);
      }
    },
    [fetchSubscriptions]
  );

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {isLoading ? (
        <div aria-live="polite">Loading...</div>
      ) : (
        <table aria-label="Subscription Management" role="grid">
          <thead>
            <tr role="row">
              <th role="columnheader">User ID</th>
              <th role="columnheader">Plan ID</th>
              <th role="columnheader">Start Date</th>
              <th role="columnheader">End Date</th>
              <th role="columnheader">Status</th>
              <th role="columnheader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription, index) => (
              <tr key={index} role="row">
                <td role="cell">{subscription.userId}</td>
                <td role="cell">{subscription.planId}</td>
                <td role="cell">{subscription.startDate.toLocaleDateString()}</td>
                <td role="cell">{subscription.endDate.toLocaleDateString()}</td>
                <td role="cell">{subscription.status}</td>
                <td role="cell">
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(subscription.userId, subscription.planId)}
                      aria-label={`Cancel subscription for user ${subscription.userId} and plan ${subscription.planId}`}
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