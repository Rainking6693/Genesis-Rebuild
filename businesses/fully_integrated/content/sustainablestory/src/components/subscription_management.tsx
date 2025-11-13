import React, { useState, useEffect } from 'react';
import { Subscription, SubscriptionStatus } from './subscription.model';
import axios from 'axios';

interface Props {
  subscription: Subscription;
  onStatusChange: (status: SubscriptionStatus) => void;
}

const MyComponent: React.FC<Props> = ({ subscription, onStatusChange }) => {
  const [status, setStatus] = useState<SubscriptionStatus>(subscription.status ?? SubscriptionStatus.UNKNOWN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`/api/subscriptions/${subscription.id}`);
        setStatus(response.data.status);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchInitialData();
  }, [subscription.id]);

  const handleRenewSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/subscriptions/${subscription.id}/renew`);
      setStatus(response.data?.status ?? SubscriptionStatus.UNKNOWN);
      onStatusChange(response.data?.status ?? SubscriptionStatus.UNKNOWN);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/subscriptions/${subscription.id}`);
      setStatus(response.data?.status ?? SubscriptionStatus.UNKNOWN);
      onStatusChange(response.data?.status ?? SubscriptionStatus.UNKNOWN);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscription Status: {status}</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message ?? 'An error occurred.'}</p>}
      {status === SubscriptionStatus.ACTIVE && (
        <button onClick={handleRenewSubscription} disabled={isLoading}>
          {isLoading ? 'Renewing Subscription...' : 'Renew Subscription'}
        </button>
      )}
      {status === SubscriptionStatus.CANCELED && (
        <button onClick={handleCancelSubscription} disabled={isLoading}>
          {isLoading ? 'Reactivating Subscription...' : 'Reactivate Subscription'}
        </button>
      )}
    </div>
  );
};

export default MyComponent;