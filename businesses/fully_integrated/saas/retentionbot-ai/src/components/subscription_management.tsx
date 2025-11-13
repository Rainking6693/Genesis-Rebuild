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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelTokenSource = useRef(axios.CancelToken.source());

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<SubscriptionProps[]> = await axios.get<
        SubscriptionProps[]
      >('/api/subscriptions', {
        cancelToken: cancelTokenSource.current.token,
      });
      setSubscriptions(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'Error fetching subscriptions'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      cancelTokenSource.current.cancel('Subscription fetch cancelled');
    };
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await axios.post('/api/subscriptions/cancel', { subscriptionId });
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.planId === subscriptionId
              ? { ...sub, status: 'cancelled' }
              : sub
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
      <h1>Subscription Management</h1>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <table aria-label="Subscription Management">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Plan ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.planId}>
              <td>{subscription.userId}</td>
              <td>{subscription.planId}</td>
              <td>{subscription.startDate.toLocaleDateString()}</td>
              <td>{subscription.endDate.toLocaleDateString()}</td>
              <td>{subscription.status}</td>
              <td>
                {subscription.status === 'active' && (
                  <button
                    onClick={() => handleCancelSubscription(subscription.planId)}
                    disabled={isLoading}
                  >
                    Cancel Subscription
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelTokenSource = useRef(axios.CancelToken.source());

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<SubscriptionProps[]> = await axios.get<
        SubscriptionProps[]
      >('/api/subscriptions', {
        cancelToken: cancelTokenSource.current.token,
      });
      setSubscriptions(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'Error fetching subscriptions'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    return () => {
      cancelTokenSource.current.cancel('Subscription fetch cancelled');
    };
  }, [fetchSubscriptions]);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await axios.post('/api/subscriptions/cancel', { subscriptionId });
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.planId === subscriptionId
              ? { ...sub, status: 'cancelled' }
              : sub
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
      <h1>Subscription Management</h1>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <table aria-label="Subscription Management">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Plan ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.planId}>
              <td>{subscription.userId}</td>
              <td>{subscription.planId}</td>
              <td>{subscription.startDate.toLocaleDateString()}</td>
              <td>{subscription.endDate.toLocaleDateString()}</td>
              <td>{subscription.status}</td>
              <td>
                {subscription.status === 'active' && (
                  <button
                    onClick={() => handleCancelSubscription(subscription.planId)}
                    disabled={isLoading}
                  >
                    Cancel Subscription
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionManagement;