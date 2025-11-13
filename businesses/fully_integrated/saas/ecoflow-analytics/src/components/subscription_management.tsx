import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  onSubscribe: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

interface SubscriptionManagementProps {
  apiEndpoint: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ apiEndpoint }) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: SubscriptionProps[] = await response.json();

      // Validate the data received from the API
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from the API. Expected an array.');
      }

      if (isMounted.current) {
        setSubscriptions(data);
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch subscriptions.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('Error fetching subscriptions:', err);
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchSubscriptions();

    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const handleSubscribe = useCallback(
    async (id: string) => {
      try {
        // Optimistic update: Immediately disable the button to prevent double-clicks
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: true } : sub
          )
        );

        // Call the provided onSubscribe function
        const subscription = subscriptions.find((s) => s.id === id);
        if (subscription) {
          await subscription.onSubscribe(id);
        }

        // Re-fetch subscriptions to ensure data consistency
        await fetchSubscriptions();
      } catch (err) {
        console.error('Error subscribing:', err);
        // Revert the optimistic update on error
        await fetchSubscriptions(); // Re-fetch to revert the state
        let errorMessage = 'Failed to subscribe.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    },
    [subscriptions, fetchSubscriptions]
  );

  const handleCancel = useCallback(
    async (id: string) => {
      try {
        // Optimistic update: Immediately disable the button to prevent double-clicks
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: false } : sub
          )
        );

        // Call the provided onCancel function
        const subscription = subscriptions.find((s) => s.id === id);
        if (subscription) {
          await subscription.onCancel(id);
        }

        // Re-fetch subscriptions to ensure data consistency
        await fetchSubscriptions();
      } catch (err) {
        console.error('Error cancelling:', err);
        // Revert the optimistic update on error
        await fetchSubscriptions(); // Re-fetch to revert the state
        let errorMessage = 'Failed to cancel subscription.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    },
    [subscriptions, fetchSubscriptions]
  );

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={fetchSubscriptions}>Retry</button>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <h1>Subscription Management</h1>
      {subscriptions.length === 0 ? (
        <p>No subscriptions available.</p>
      ) : (
        subscriptions.map((subscription) => (
          <div key={subscription.id}>
            <h2>{subscription.title}</h2>
            <p>{subscription.description}</p>
            <p>Price: ${subscription.price.toFixed(2)}</p>
            {subscription.isActive ? (
              <button
                onClick={() => handleCancel(subscription.id)}
                aria-label={`Cancel subscription for ${subscription.title}`}
                disabled={loading} // Disable during loading state
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(subscription.id)}
                aria-label={`Subscribe to ${subscription.title}`}
                disabled={loading} // Disable during loading state
              >
                Subscribe
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SubscriptionManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  onSubscribe: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

interface SubscriptionManagementProps {
  apiEndpoint: string;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ apiEndpoint }) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: SubscriptionProps[] = await response.json();

      // Validate the data received from the API
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from the API. Expected an array.');
      }

      if (isMounted.current) {
        setSubscriptions(data);
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch subscriptions.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('Error fetching subscriptions:', err);
      if (isMounted.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchSubscriptions();

    return () => {
      isMounted.current = false;
    };
  }, [fetchSubscriptions]);

  const handleSubscribe = useCallback(
    async (id: string) => {
      try {
        // Optimistic update: Immediately disable the button to prevent double-clicks
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: true } : sub
          )
        );

        // Call the provided onSubscribe function
        const subscription = subscriptions.find((s) => s.id === id);
        if (subscription) {
          await subscription.onSubscribe(id);
        }

        // Re-fetch subscriptions to ensure data consistency
        await fetchSubscriptions();
      } catch (err) {
        console.error('Error subscribing:', err);
        // Revert the optimistic update on error
        await fetchSubscriptions(); // Re-fetch to revert the state
        let errorMessage = 'Failed to subscribe.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    },
    [subscriptions, fetchSubscriptions]
  );

  const handleCancel = useCallback(
    async (id: string) => {
      try {
        // Optimistic update: Immediately disable the button to prevent double-clicks
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: false } : sub
          )
        );

        // Call the provided onCancel function
        const subscription = subscriptions.find((s) => s.id === id);
        if (subscription) {
          await subscription.onCancel(id);
        }

        // Re-fetch subscriptions to ensure data consistency
        await fetchSubscriptions();
      } catch (err) {
        console.error('Error cancelling:', err);
        // Revert the optimistic update on error
        await fetchSubscriptions(); // Re-fetch to revert the state
        let errorMessage = 'Failed to cancel subscription.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    },
    [subscriptions, fetchSubscriptions]
  );

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={fetchSubscriptions}>Retry</button>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <h1>Subscription Management</h1>
      {subscriptions.length === 0 ? (
        <p>No subscriptions available.</p>
      ) : (
        subscriptions.map((subscription) => (
          <div key={subscription.id}>
            <h2>{subscription.title}</h2>
            <p>{subscription.description}</p>
            <p>Price: ${subscription.price.toFixed(2)}</p>
            {subscription.isActive ? (
              <button
                onClick={() => handleCancel(subscription.id)}
                aria-label={`Cancel subscription for ${subscription.title}`}
                disabled={loading} // Disable during loading state
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(subscription.id)}
                aria-label={`Subscribe to ${subscription.title}`}
                disabled={loading} // Disable during loading state
              >
                Subscribe
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SubscriptionManagement;