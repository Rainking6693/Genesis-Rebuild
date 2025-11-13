import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Subscription {
  id: string;
  name: string;
  status: string;
}

interface SubscriptionProps {
  title: string;
  content: string;
  userId: string;
}

const SubscriptionManagement: React.FC<SubscriptionProps> = ({ title, content, userId }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<Subscription[]> = await axios.get<Subscription[]>(
        `/api/subscriptions?userId=${userId}`,
        { signal }
      );
      setSubscriptions(response.data);
      setLoading(false);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(axiosError.message || 'Error fetching subscriptions');
        setLoading(false);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscriptions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscriptions]);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <h2>Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>You don't have any subscriptions yet.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              {subscription.name} - {subscription.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Subscription {
  id: string;
  name: string;
  status: string;
}

interface SubscriptionProps {
  title: string;
  content: string;
  userId: string;
}

const SubscriptionManagement: React.FC<SubscriptionProps> = ({ title, content, userId }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<Subscription[]> = await axios.get<Subscription[]>(
        `/api/subscriptions?userId=${userId}`,
        { signal }
      );
      setSubscriptions(response.data);
      setLoading(false);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(axiosError.message || 'Error fetching subscriptions');
        setLoading(false);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscriptions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscriptions]);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <h2>Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>You don't have any subscriptions yet.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              {subscription.name} - {subscription.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionManagement;