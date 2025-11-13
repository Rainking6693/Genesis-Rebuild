import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionData {
  id: string;
  title: string;
  content: string;
  price: number;
  interval: string;
}

interface SubscriptionResponse {
  data: SubscriptionData;
}

interface SubscriptionError {
  message: string;
}

const StripeBilling: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptionData = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response: AxiosResponse<SubscriptionResponse> = await axios.get<SubscriptionResponse>(
        '/api/subscription',
        { signal: abortControllerRef.current.signal }
      );
      setSubscriptionData(response.data.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Fetch subscription data request cancelled');
      } else {
        const axiosError = err as AxiosError<SubscriptionError>;
        setError(`Error fetching subscription data: ${axiosError.response?.data.message || axiosError.message}`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscriptionData]);

  const handleSubscription = useCallback(async () => {
    if (!subscriptionData) return;

    try {
      setIsLoading(true);
      await axios.post('/api/subscribe', { subscriptionId: subscriptionData.id });
      // Handle successful subscription
    } catch (err) {
      const axiosError = err as AxiosError<SubscriptionError>;
      setError(`Error subscribing: ${axiosError.response?.data.message || axiosError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchSubscriptionData}>Retry</button>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  return (
    <div>
      <h1>{subscriptionData.title}</h1>
      <p>{subscriptionData.content}</p>
      <p>Price: ${subscriptionData.price} / {subscriptionData.interval}</p>
      <button
        onClick={handleSubscription}
        disabled={isLoading}
        aria-label={isLoading ? 'Loading...' : 'Subscribe'}
      >
        {isLoading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionData {
  id: string;
  title: string;
  content: string;
  price: number;
  interval: string;
}

interface SubscriptionResponse {
  data: SubscriptionData;
}

interface SubscriptionError {
  message: string;
}

const StripeBilling: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSubscriptionData = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response: AxiosResponse<SubscriptionResponse> = await axios.get<SubscriptionResponse>(
        '/api/subscription',
        { signal: abortControllerRef.current.signal }
      );
      setSubscriptionData(response.data.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Fetch subscription data request cancelled');
      } else {
        const axiosError = err as AxiosError<SubscriptionError>;
        setError(`Error fetching subscription data: ${axiosError.response?.data.message || axiosError.message}`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSubscriptionData]);

  const handleSubscription = useCallback(async () => {
    if (!subscriptionData) return;

    try {
      setIsLoading(true);
      await axios.post('/api/subscribe', { subscriptionId: subscriptionData.id });
      // Handle successful subscription
    } catch (err) {
      const axiosError = err as AxiosError<SubscriptionError>;
      setError(`Error subscribing: ${axiosError.response?.data.message || axiosError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchSubscriptionData}>Retry</button>
      </div>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  return (
    <div>
      <h1>{subscriptionData.title}</h1>
      <p>{subscriptionData.content}</p>
      <p>Price: ${subscriptionData.price} / {subscriptionData.interval}</p>
      <button
        onClick={handleSubscription}
        disabled={isLoading}
        aria-label={isLoading ? 'Loading...' : 'Subscribe'}
      >
        {isLoading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;