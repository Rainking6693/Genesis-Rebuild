import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  userId: string;
  planName: string;
  planPrice: number;
  subscriptionStatus: 'active' | 'cancelled' | 'pending';
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
}

const SubscriptionManagement: React.FC = () => {
  const [userSubscription, setUserSubscription] = useState<SubscriptionProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscription = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscriptions/${userSubscription?.userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setUserSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError('Failed to fetch subscription data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [userSubscription?.userId]);

  useEffect(() => {
    fetchSubscription();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscription]);

  const handleCancelSubscription = useCallback(async () => {
    if (!userSubscription) return;
    setIsLoading(true);
    setError(null);

    try {
      await fetch(`/api/subscriptions/${userSubscription.userId}`, {
        method: 'DELETE',
      });
      setUserSubscription((prevState) =>
        prevState ? { ...prevState, subscriptionStatus: 'cancelled' } : null
      );
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [userSubscription]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Subscription Management</h1>
        <p aria-live="assertive">Error: {error}</p>
      </div>
    );
  }

  if (!userSubscription) {
    return (
      <div>
        <h1>Subscription Management</h1>
        <p>No subscription data available.</p>
      </div>
    );
  }

  const { planName, planPrice, subscriptionStatus, subscriptionStartDate, subscriptionEndDate } = userSubscription;

  return (
    <div>
      <h1>Subscription Management</h1>
      <div>
        <h2>Plan Details</h2>
        <p>Plan Name: {planName}</p>
        <p>Plan Price: ${planPrice.toFixed(2)}</p>
      </div>
      <div>
        <h2>Subscription Status</h2>
        <p>Status: {subscriptionStatus}</p>
        <p>Start Date: {subscriptionStartDate.toLocaleDateString()}</p>
        <p>End Date: {subscriptionEndDate.toLocaleDateString()}</p>
      </div>
      {subscriptionStatus === 'active' && (
        <button onClick={handleCancelSubscription} disabled={isLoading}>
          Cancel Subscription
        </button>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  userId: string;
  planName: string;
  planPrice: number;
  subscriptionStatus: 'active' | 'cancelled' | 'pending';
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
}

const SubscriptionManagement: React.FC = () => {
  const [userSubscription, setUserSubscription] = useState<SubscriptionProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscription = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscriptions/${userSubscription?.userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setUserSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError('Failed to fetch subscription data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [userSubscription?.userId]);

  useEffect(() => {
    fetchSubscription();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscription]);

  const handleCancelSubscription = useCallback(async () => {
    if (!userSubscription) return;
    setIsLoading(true);
    setError(null);

    try {
      await fetch(`/api/subscriptions/${userSubscription.userId}`, {
        method: 'DELETE',
      });
      setUserSubscription((prevState) =>
        prevState ? { ...prevState, subscriptionStatus: 'cancelled' } : null
      );
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [userSubscription]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Subscription Management</h1>
        <p aria-live="assertive">Error: {error}</p>
      </div>
    );
  }

  if (!userSubscription) {
    return (
      <div>
        <h1>Subscription Management</h1>
        <p>No subscription data available.</p>
      </div>
    );
  }

  const { planName, planPrice, subscriptionStatus, subscriptionStartDate, subscriptionEndDate } = userSubscription;

  return (
    <div>
      <h1>Subscription Management</h1>
      <div>
        <h2>Plan Details</h2>
        <p>Plan Name: {planName}</p>
        <p>Plan Price: ${planPrice.toFixed(2)}</p>
      </div>
      <div>
        <h2>Subscription Status</h2>
        <p>Status: {subscriptionStatus}</p>
        <p>Start Date: {subscriptionStartDate.toLocaleDateString()}</p>
        <p>End Date: {subscriptionEndDate.toLocaleDateString()}</p>
      </div>
      {subscriptionStatus === 'active' && (
        <button onClick={handleCancelSubscription} disabled={isLoading}>
          Cancel Subscription
        </button>
      )}
    </div>
  );
};

export default SubscriptionManagement;