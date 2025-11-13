import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
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
            sub.id === subscriptionId ? { ...sub, status: 'cancelled' } : sub
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
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      <table aria-label="Subscription Management" className="subscription-table">
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
            <tr key={subscription.id}>
              <td>{subscription.userId}</td>
              <td>{subscription.planId}</td>
              <td>{subscription.startDate.toLocaleDateString()}</td>
              <td>{subscription.endDate.toLocaleDateString()}</td>
              <td>{subscription.status}</td>
              <td>
                {subscription.status === 'active' && (
                  <button
                    onClick={() => handleCancelSubscription(subscription.id)}
                    aria-label={`Cancel subscription for user ${subscription.userId}`}
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
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
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
            sub.id === subscriptionId ? { ...sub, status: 'cancelled' } : sub
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
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      <table aria-label="Subscription Management" className="subscription-table">
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
            <tr key={subscription.id}>
              <td>{subscription.userId}</td>
              <td>{subscription.planId}</td>
              <td>{subscription.startDate.toLocaleDateString()}</td>
              <td>{subscription.endDate.toLocaleDateString()}</td>
              <td>{subscription.status}</td>
              <td>
                {subscription.status === 'active' && (
                  <button
                    onClick={() => handleCancelSubscription(subscription.id)}
                    aria-label={`Cancel subscription for user ${subscription.userId}`}
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
    </div>
  );
};

export default SubscriptionManagement;