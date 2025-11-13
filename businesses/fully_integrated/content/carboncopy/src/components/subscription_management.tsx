import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionManagementProps {
  userEmail: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionRenewalDate: Date;
  onCancelSubscription: () => Promise<void>;
  onUpdateSubscription: (newPlan: string) => Promise<void>;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  userEmail,
  subscriptionPlan,
  subscriptionStatus,
  subscriptionRenewalDate,
  onCancelSubscription,
  onUpdateSubscription,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptionData = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setError(null);
    try {
      // Fetch data and update state
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred while fetching subscription data.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptionData]);

  const handleCancelSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onCancelSubscription();
      // Update UI to reflect subscription cancellation
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred while cancelling the subscription.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [onCancelSubscription]);

  const handleUpdateSubscription = useCallback(
    async (newPlan: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await onUpdateSubscription(newPlan);
        // Update UI to reflect subscription update
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred while updating the subscription.'));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateSubscription]
  );

  return (
    <div>
      <h2>Subscription Management</h2>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div role="alert">Error: {error.message}</div>
      ) : (
        <>
          <p>Email: {userEmail}</p>
          <p>Subscription Plan: {subscriptionPlan}</p>
          <p>Subscription Status: {subscriptionStatus}</p>
          <p>Renewal Date: {subscriptionRenewalDate.toLocaleDateString()}</p>
          <button
            onClick={handleCancelSubscription}
            disabled={isLoading}
            aria-label="Cancel Subscription"
          >
            Cancel Subscription
          </button>
          <button
            onClick={() => handleUpdateSubscription('premium')}
            disabled={isLoading}
            aria-label="Upgrade to Premium"
          >
            Upgrade to Premium
          </button>
        </>
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionManagementProps {
  userEmail: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionRenewalDate: Date;
  onCancelSubscription: () => Promise<void>;
  onUpdateSubscription: (newPlan: string) => Promise<void>;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  userEmail,
  subscriptionPlan,
  subscriptionStatus,
  subscriptionRenewalDate,
  onCancelSubscription,
  onUpdateSubscription,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptionData = useCallback(async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setError(null);
    try {
      // Fetch data and update state
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred while fetching subscription data.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptionData]);

  const handleCancelSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onCancelSubscription();
      // Update UI to reflect subscription cancellation
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred while cancelling the subscription.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [onCancelSubscription]);

  const handleUpdateSubscription = useCallback(
    async (newPlan: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await onUpdateSubscription(newPlan);
        // Update UI to reflect subscription update
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred while updating the subscription.'));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateSubscription]
  );

  return (
    <div>
      <h2>Subscription Management</h2>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div role="alert">Error: {error.message}</div>
      ) : (
        <>
          <p>Email: {userEmail}</p>
          <p>Subscription Plan: {subscriptionPlan}</p>
          <p>Subscription Status: {subscriptionStatus}</p>
          <p>Renewal Date: {subscriptionRenewalDate.toLocaleDateString()}</p>
          <button
            onClick={handleCancelSubscription}
            disabled={isLoading}
            aria-label="Cancel Subscription"
          >
            Cancel Subscription
          </button>
          <button
            onClick={() => handleUpdateSubscription('premium')}
            disabled={isLoading}
            aria-label="Upgrade to Premium"
          >
            Upgrade to Premium
          </button>
        </>
      )}
    </div>
  );
};

export default SubscriptionManagement;