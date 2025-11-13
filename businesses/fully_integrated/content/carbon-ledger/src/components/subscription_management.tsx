import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  title: string;
  description: string;
  price: number;
  duration: string;
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
      const response = await axios.get<SubscriptionProps[]>('/api/subscriptions', {
        signal: abortControllerRef.current.signal,
      });
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred while fetching subscriptions.'
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

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="assertive" aria-busy="true">
          Loading...
        </div>
      ) : (
        <div className="subscription-list" aria-live="polite">
          {subscriptions.length === 0 ? (
            <p>No subscriptions available.</p>
          ) : (
            subscriptions.map((subscription, index) => (
              <div key={index} className="subscription-card">
                <h2>{subscription.title}</h2>
                <p>{subscription.description}</p>
                <p>Price: ${subscription.price}</p>
                <p>Duration: {subscription.duration}</p>
                <button className="subscribe-button" aria-label={`Subscribe to ${subscription.title}`}>
                  Subscribe
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SubscriptionProps {
  title: string;
  description: string;
  price: number;
  duration: string;
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
      const response = await axios.get<SubscriptionProps[]>('/api/subscriptions', {
        signal: abortControllerRef.current.signal,
      });
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Subscription fetch cancelled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred while fetching subscriptions.'
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

  return (
    <div>
      <h1>Subscription Management</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="assertive" aria-busy="true">
          Loading...
        </div>
      ) : (
        <div className="subscription-list" aria-live="polite">
          {subscriptions.length === 0 ? (
            <p>No subscriptions available.</p>
          ) : (
            subscriptions.map((subscription, index) => (
              <div key={index} className="subscription-card">
                <h2>{subscription.title}</h2>
                <p>{subscription.description}</p>
                <p>Price: ${subscription.price}</p>
                <p>Duration: {subscription.duration}</p>
                <button className="subscribe-button" aria-label={`Subscribe to ${subscription.title}`}>
                  Subscribe
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;