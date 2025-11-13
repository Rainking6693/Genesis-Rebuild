import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Subscription {
  title: string;
  content: string;
  expirationDate: Date;
}

interface SubscriptionProps {
  userId: string;
}

const SubscriptionManagement: React.FC<SubscriptionProps> = ({ userId }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<Subscription> = await axios.get<Subscription>(
        `/api/subscriptions/${userId}`,
        { signal }
      );
      setSubscription(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Fetch subscription request cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching the subscription.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscription();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscription]);

  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div aria-live="polite" role="alert">
        {error}
      </div>
    );
  }

  if (!subscription) {
    return (
      <div aria-live="polite" role="alert">
        No subscription found.
      </div>
    );
  }

  return (
    <div>
      <h1>{subscription.title}</h1>
      <p>{subscription.content}</p>
      <p>Subscription expires on: {subscription.expirationDate.toLocaleDateString()}</p>
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Subscription {
  title: string;
  content: string;
  expirationDate: Date;
}

interface SubscriptionProps {
  userId: string;
}

const SubscriptionManagement: React.FC<SubscriptionProps> = ({ userId }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<Subscription> = await axios.get<Subscription>(
        `/api/subscriptions/${userId}`,
        { signal }
      );
      setSubscription(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Fetch subscription request cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching the subscription.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscription();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscription]);

  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div aria-live="polite" role="alert">
        {error}
      </div>
    );
  }

  if (!subscription) {
    return (
      <div aria-live="polite" role="alert">
        No subscription found.
      </div>
    );
  }

  return (
    <div>
      <h1>{subscription.title}</h1>
      <p>{subscription.content}</p>
      <p>Subscription expires on: {subscription.expirationDate.toLocaleDateString()}</p>
    </div>
  );
};

export default SubscriptionManagement;