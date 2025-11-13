import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

interface FetchSubscriptionsResponse {
  data: SubscriptionProps[];
  message?: string;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<FetchSubscriptionsResponse> = await axios.get('/api/subscriptions');
      setSubscriptions(response.data.data);
      setError(response.data.message || null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching subscriptions.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="assertive">
          Loading...
        </div>
      ) : (
        <table aria-label="Subscription List" className="subscription-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Plan ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription, index) => (
                <tr key={index}>
                  <td>{subscription.userId}</td>
                  <td>{subscription.planId}</td>
                  <td>{subscription.startDate.toLocaleDateString()}</td>
                  <td>{subscription.endDate.toLocaleDateString()}</td>
                  <td>{subscription.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}

interface FetchSubscriptionsResponse {
  data: SubscriptionProps[];
  message?: string;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<FetchSubscriptionsResponse> = await axios.get('/api/subscriptions');
      setSubscriptions(response.data.data);
      setError(response.data.message || null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching subscriptions.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="assertive">
          Loading...
        </div>
      ) : (
        <table aria-label="Subscription List" className="subscription-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Plan ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription, index) => (
                <tr key={index}>
                  <td>{subscription.userId}</td>
                  <td>{subscription.planId}</td>
                  <td>{subscription.startDate.toLocaleDateString()}</td>
                  <td>{subscription.endDate.toLocaleDateString()}</td>
                  <td>{subscription.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubscriptionManagement;